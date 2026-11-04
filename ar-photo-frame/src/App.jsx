import React,{useEffect,useRef,useState}from'react';
import{Camera,Download,RefreshCw,RotateCcw,Sparkles}from'lucide-react';
const R=9/16,MAXW=4320,MAXH=7680;
const FRAMES=[
{id:'01',name:'フレーム 01',src:'/frames/frame01.png'},
{id:'02',name:'フレーム 02',src:'/frames/frame02.png'},
{id:'03',name:'フレーム 03',src:'/frames/frame03.png'}
];
async function loadBitmap(blob){if('createImageBitmap'in window)return createImageBitmap(blob);return new Promise((ok,ng)=>{const img=new Image();const url=URL.createObjectURL(blob);img.onload=()=>{URL.revokeObjectURL(url);ok(img)};img.onerror=e=>{URL.revokeObjectURL(url);ng(e)};img.src=url})}
function CameraView({frame}){
const videoRef=useRef(null),canvasRef=useRef(null),streamRef=useRef(null),frameRef=useRef(null);
const[mode,setMode]=useState('environment'),[shot,setShot]=useState(null),[err,setErr]=useState(''),[res,setRes]=useState(''),[busy,setBusy]=useState(false),[method,setMethod]=useState('');
async function start(m=mode){setErr('');streamRef.current?.getTracks().forEach(t=>t.stop());try{const st=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:m},width:{ideal:3840},height:{ideal:2160}},audio:false});streamRef.current=st;if(videoRef.current)videoRef.current.srcObject=st;const settings=st.getVideoTracks()[0]?.getSettings?.();if(settings?.width&&settings?.height)setRes(`${settings.width} x ${settings.height}`)}catch(e){setErr('カメラを起動できません。カメラ権限を確認してください。')}}
useEffect(()=>{start('environment');return()=>streamRef.current?.getTracks().forEach(t=>t.stop())},[]);
async function flip(){const next=mode==='user'?'environment':'user';setMode(next);await start(next)}
function drawAndSave(img,iw,ih,isFront,label){const C=canvasRef.current,F=frameRef.current;let sw=iw,sh=ih,sx=0,sy=0;if(sw/sh>R){sw=sh*R;sx=(iw-sw)/2}else{sh=sw/R;sy=(ih-sh)/2}let ow=Math.min(MAXW,Math.floor(sw)),oh=Math.round(ow/R);if(oh>MAXH){oh=MAXH;ow=Math.round(oh*R)}C.width=ow;C.height=oh;const x=C.getContext('2d',{alpha:false});x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';if(isFront){x.translate(ow,0);x.scale(-1,1)}x.drawImage(img,sx,sy,sw,sh,0,0,ow,oh);if(isFront)x.setTransform(1,0,0,1,0,0);if(F?.complete&&F.naturalWidth)x.drawImage(F,0,0,ow,oh);C.toBlob(blob=>{if(!blob){setBusy(false);setErr('画像生成に失敗しました。');return}if(shot)URL.revokeObjectURL(shot);setShot(URL.createObjectURL(blob));setMethod(`${label} / ${ow} x ${oh}`);setBusy(false)},'image/jpeg',1)}
function fallback(){const V=videoRef.current;if(!V?.videoWidth)throw new Error('video unavailable');drawAndSave(V,V.videoWidth,V.videoHeight,mode==='user','Video fallback')}
async function capture(){if(busy)return;setBusy(true);setErr('');try{const track=streamRef.current?.getVideoTracks?.()[0];if(window.ImageCapture&&track){try{const ic=new ImageCapture(track);let options={};try{const cap=await ic.getPhotoCapabilities();if(cap?.imageWidth?.max)options.imageWidth=cap.imageWidth.max;if(cap?.imageHeight?.max)options.imageHeight=cap.imageHeight.max}catch{}const blob=await ic.takePhoto(options);const bmp=await loadBitmap(blob);drawAndSave(bmp,bmp.width||bmp.naturalWidth,bmp.height||bmp.naturalHeight,mode==='user','Still photo');return}catch(e){console.warn('takePhoto fallback',e)}}fallback()}catch(e){setBusy(false);setErr('撮影に失敗しました。再読み込みしてお試しください。')}}
function save(){const a=document.createElement('a');a.href=shot;a.download=`ar-photo-${frame.id}-${Date.now()}.jpg`;a.click()}
return <main className="app"><div className="wrap"><div className="head"><div><div className="eyebrow">AR PHOTO FRAME</div><h1 className="title">{frame.name}</h1></div><Sparkles size={18} color="#c4b5fd"/></div><div className="viewer"><div className="stage">{!shot?<><video ref={videoRef} autoPlay playsInline muted className={mode==='user'?'mirror':''}/><img ref={frameRef} src={frame.src} className="overlay" alt={frame.name}/></>:<img className="shot" src={shot} alt="撮影結果"/>}</div></div><div className="bottom">{!shot&&res&&<p className="resolution">Camera: {res}</p>}{shot&&method&&<p className="resolution">{method}</p>}{err&&<p className="error">{err}</p>}<canvas ref={canvasRef} className="hidden"/><div className="controls">{!shot?<><button className="btn action" onClick={flip} disabled={busy}><RotateCcw/><span>カメラ切替</span></button><button className="btn shutter action" onClick={capture} disabled={busy}><Camera/><span>撮影</span></button><button className="btn action" onClick={()=>start(mode)} disabled={busy}><RefreshCw/><span>再読み込み</span></button></>:<><button className="btn" onClick={()=>{URL.revokeObjectURL(shot);setShot(null);setMethod('')}}><RefreshCw/></button><button className="btn save" onClick={save}><Download size={18}/>画像を保存</button></>}</div></div></div></main>;
}
export default function App(){
const requested=new URLSearchParams(window.location.search).get('frame');
const direct=FRAMES.find(fr=>fr.id===requested)||null;
const[selected,setSelected]=useState(direct);
function choose(fr){const u=new URL(window.location.href);u.searchParams.set('frame',fr.id);window.history.replaceState({},'',u);setSelected(fr)}
if(selected)return <CameraView frame={selected}/>;
return <main className="selector"><div className="selector-inner"><h1>フォトフレームを選択</h1><p>好きなデザインを選択してください。</p><div className="frame-grid">{FRAMES.map(fr=><button key={fr.id} className="frame-card" onClick={()=>choose(fr)}><div className="thumb"><img src={fr.src} alt={fr.name}/></div><span className="frame-name">{fr.name}</span></button>)}</div></div></main>;
}
