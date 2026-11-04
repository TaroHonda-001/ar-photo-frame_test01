複数フレーム対応版（iPhone / Android、高画質撮影）

■ 使い方
URLにframe指定なし:
https://YOUR-DOMAIN.vercel.app/
→ フレーム選択画面を表示

直接指定:
https://YOUR-DOMAIN.vercel.app/?frame=01
https://YOUR-DOMAIN.vercel.app/?frame=02
https://YOUR-DOMAIN.vercel.app/?frame=03
→ 指定フレームで撮影画面を直接表示

■ PNG
public/frames/frame01.png
public/frames/frame02.png
public/frames/frame03.png
各1080 x 1920 px、透明PNG推奨。
サンプルPNGを同梱しているので本番デザインへ同名で置換してください。

■ フレーム追加
src/App.jsx の FRAMES に項目を追加し、public/frames に対応PNGを追加します。
例: {id:'04',name:'フレーム 04',src:'/frames/frame04.png'}

■ 撮影
ImageCapture.takePhoto()が利用可能なら静止画撮影を優先。失敗・非対応時は動画フレームへ自動フォールバック。
UIは9:16全体を縦横比維持で表示します。
