iPhone・Android両対応 高画質9:16 + PNGフレーム版

・UIは9:16全体を縦横比を維持して画面内へ表示します。
・ImageCapture.takePhoto()対応ブラウザでは静止画撮影を優先します。
・takePhoto()が未対応または失敗した場合は、動画ストリームのフレーム取得へ自動フォールバックします。
・iPhone Safari、Android Chrome、Samsung Internet等を想定した機能検出方式です。
・静止画能力を取得できる場合は最大のimageWidth/imageHeightを要求します。
・合成出力は最大4320 x 7680、JPEG品質1.0。ただし元画像以上の実質画質にはなりません。
・public/frame.pngは1080 x 1920の透明PNGです。撮影結果へ出力解像度に合わせて拡大合成します。
・撮影結果画面には Still photo または Video fallback と実際の保存解像度を表示します。
