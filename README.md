## 構成
Amplify + React

![システム構成図](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/121860/6956320d-9bb3-c7d8-d6b9-4e5d595001ff.png)

## 開発の流れ

作業は各自でAmplifyとgithubの作業ブランチを作成し、開発を行ます。

「Getting Started」から始めてください。

発行されたAmplifyのURLでLIFFの確認を行ます。

作業が終わったら、mainブランチにプルリクエストを送ってください。

APIを追加する場合は「API Gateway の path追加」を参考にしてください。

## Getting Started

```bash
git clone https://github.com/mochan-tk/jaws-days-2021-voting-line-app.git

cd jaws-days-2021-voting-line-app

# 既にあるmainブランチ(amplifyではdevの環境が対応する)の設定を元に環境を構築する
# [accessKeyId]と[secretAccessKey]はcsvで送るaws_access_key_idとaws_secret_access_keyを入力
amplify init
? Do you want to use an existing environment? (Y/n) y
? Choose the environment you would like to use: (Use arrow keys) dev
? Choose your default editor: Visual Studio Code
? Select the authentication method you want to use: (Use arrow keys) AWS profile
? AWS access credentials can not be found.
? Setup new user (Y/n) n
? accessKeyId:  [hidden] 
? secretAccessKey:  [hidden]   
? region:  ap-northeast-1

# 自分の開発環境を構築し切り替える（自分の名前で環境を作る）
amplify env add
? Do you want to use an existing environment? (Y/n) n
? Enter a name for the environment <開発環境名をいれる>
? Select the authentication method you want to use: (Use arrow keys) AWS profile 
? Please choose the profile you want to use (Use arrow keys) default

# ＊印がついているのが現在選択されている環境で、これが作成した環境名になっているか確認する
amplify env list

| Environments |
| ------------ |
| dev          |
| *mochantk    |

# 下記にてデプロイ
amplify status
amplify push
? Are you sure you want to continue? (Y/n) y

# 先ほどデプロイしたAmplifyの開発環境とローカル環境の同期をとる
amplify pull

# 事前にLIFFを作成します。
# 作業ブランチのLambda Console画面に移動し、環境変数に「Liff Id」を設定する（キー：LIFF_ID）

# 必要なモジュールのインストール
npm install

# ちなみにローカル環境でアプリ起動する時。
# http://localhost:3000 で確認します。
npm run dev
# or
yarn dev

# 動作確認は自身の作業ブランチにpushを行い、Amplify Console（jawsdays2021） の Frontend environmentsにて[ブランチの接続]を行います。
# 詳しくはこちら(https://docs.google.com/presentation/d/1d3034Czy2rzWb_Q4KWs8T41BqG2l0ZkNblO6DbBrbMQ/edit?usp=sharing)


```

## API Gateway の path追加

```bash
amplify update api
? Please select from one of the below mentioned services: REST
? Please select the REST API you would want to update votingApiGateway
? What would you like to do Add another path
? Provide a path (e.g., /book/{isbn}): /xxxx
? Choose a Lambda source Use a Lambda function already added in the current Amplify project
? Choose the Lambda function to invoke by this path 
? Restrict API access No
? Do you want to add another path? No


amplify push

```

## その他
手元の環境で上手くいかない場合はCloud9を使ってみてください。

主要な変更するファイルは下記などです。

- フロントエンド
    - src/App.tsx
- バックエンド(変更した際は「amplify push」してデプロイします。)
    - amplify/backend/function/votingLambda/src/app.js
