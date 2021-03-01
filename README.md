## 構成
Amplify + React


## 開発の流れ

作業は各自でAmplifyとgithubの作業ブランチを作成し、開発を行ます。

「Getting Started」から始めてください。

動作確認は自身の作業ブランチにpushを行い、Amplify Front（jawsdays2021）にて[ブランチの接続]を行います。

自身のブランチを追加し、ビルドを行ます。

発行されたURLでLIFFの確認を行ます。

作業が終わったら、mainブランチにプルリクエストを送ってください。


## Getting Started

```bash
git clone https://github.com/mochan-tk/jaws-days-2021-voting-app.git

cd jaws-days-2021-voting-app

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
# Liff Id を設定する
lambda の環境変数に設定する（キー：LIFF_ID）

# 必要なモジュールのインストール
npm install

# ちなみにローカル環境でアプリ起動する時。
# http://localhost:3000 で確認します。
npm run dev
# or
yarn dev

```

## その他
手元の環境で上手くいかない場合はCloud9を使ってみてください。

主要な変更するファイルは下記などです。

- フロントエンド
    - pages/index.tsx
- バックエンド
    - amplify/backend/function/votingLambda/src/app.js


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!