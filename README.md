# VRC Player Tag Marker

プレイヤーごとに頭上にタグを表示するワールド用アセット

## Install

### VCC用インストーラーunitypackageによる方法（おすすめ）

https://github.com/Narazaka/VRCPlayerTagMarker/releases/latest から `net.narazaka.vrchat.tag-marker-installer.zip` をダウンロードして解凍し、対象のプロジェクトにインポートする。

### VCCによる方法

1. https://vpm.narazaka.net/ から「Add to VCC」ボタンを押してリポジトリをVCCにインストールします。
2. VCCでSettings→Packages→Installed Repositoriesの一覧中で「Narazaka VPM Listing」にチェックが付いていることを確認します。
3. アバタープロジェクトの「Manage Project」から「VRC Player Tag Marker」をインストールします。

## Usage

1. Packages/VRC Player Tag Marker/World/TagMarker プレハブをシーンに配置
2. 「タグを編集する」ボタンからWebサイトを開きタグを設定
3. ダウンロードしたテクスチャを設定
4. 「Make Materials」ボタンからマテリアルを作成
5. 「Setup」ボタンを押してUIに反映
6. サイズなどを調整して好きな所に置いてください。

## 更新履歴

- 0.3.1:
  - mipmap有効にすると境界付近に変な線が出る問題への暫定対処
- 0.3.0:
  - (破壊的変更) 複数レンダラー対応
  - GPU Instancingでセットアップするように
  - Sample追加
  - Webサイトのエラーを修正
- 0.2.0: エディタを整備
- 0.1.1: changelogUrl等をpackage定義に追加
- 0.1.0: 頑張ってプレハブ組めばとりあえず最低限動く

## License

[Zlib License](LICENSE.txt)
