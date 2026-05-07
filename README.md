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

- 0.4.1:
  - fix(shader): ミラーで反転表示するように（文字が読めるように）
- 0.4.0:
  - feat: タグの移動に対応（png形式が変わるので一回pngをWebにインポートして再ダウンロードが必要です）
  - feat: フォントサイズ基準のサイズ計算
  - feat(web): 画像の解像度倍率変更機能
  - fix(shader): シェーダー最適化
  - fix(shader): mipmapを正しく適用するように
  - fix(shader): D3D11コンパイルエラー修正
  - feat(shader): 16x32グリッドまでサポートするように
  - (破壊的変更) TagMarkerUI自体がスケールされてしまって、ユーザーでのカスタムスケーリングと競合していた問題を修正。
    - 新たにAspectRatioという親オブジェクトを作り、そちらをスケールするようにした。
    - 再Setup時にはTagMarkerUIの手動でのスケール変更（アスペクト比を1:1にする）が必要です。
  - (破壊的変更) TagMarkerViewOnPlayerがタグスケールによってかぶる調整問題を修正。
    - 新たにOffsetという親オブジェクトを作った。
    - タグ下端が一定になるようレンダラーのy位置を調整するようにした。
    - 再Setup時にはOffsetの手動でのy変更が必要な可能性があります。
- 0.4.0-beta.5:
  - feat(shader): 16x32グリッドまでサポートするように
- 0.4.0-beta.4:
  - fix(shader): mipmapを正しく適用するように
- 0.4.0-beta.3:
  - feat(web): 画像の解像度倍率変更機能
  - feat(web): セルや列の途中挿入・削除機能
  - fix(shader): シェーダー最適化
- 0.4.0-beta.2:
  - リリースパッケージからテスト除外
- 0.4.0-beta.1:
  - feat: フォントサイズ基準のサイズ計算
  - (破壊的変更) TagMarkerUI自体がスケールされてしまって、ユーザーでのカスタムスケーリングと競合していた問題を修正。
    - 新たにAspectRatioという親オブジェクトを作り、そちらをスケールするようにした。
    - 再Setup時にはTagMarkerUIの手動でのスケール変更（アスペクト比を1:1にする）が必要です。
  - (破壊的変更) TagMarkerViewOnPlayerがタグスケールによってかぶる調整問題を修正。
    - 新たにOffsetという親オブジェクトを作った。
    - タグ下端が一定になるようレンダラーのy位置を調整するようにした。
    - 再Setup時にはOffsetの手動でのy変更が必要な可能性があります。
- 0.4.0-beta.0: タグの移動に対応（png形式が変わるので一回pngをWebにインポートして再ダウンロードが必要です）
- 0.3.3: エディタのvalid判定不具合修正
- 0.3.2: デフォルト位置調整
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
