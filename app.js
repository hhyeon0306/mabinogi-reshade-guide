'use strict';
const labels = ['시작 전 확인','공식 파일 받기','게임 파일 선택','그래픽 방식 선택','효과 설치','게임에서 확인','색감 조절','문제 해결·제거'];
const $ = selector => document.querySelector(selector);
const storageKey = 'mabinogi-reshade-guide-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { /* Private browsing can disable storage. */ }
let completed = new Set(Array.isArray(saved.completed) ? saved.completed.filter(n => Number.isInteger(n) && n >= 0 && n < 8) : []);
let engine = ['vulkan','dx9'].includes(saved.engine) ? saved.engine : '';
let step = 0;
function persist() { try { localStorage.setItem(storageKey, JSON.stringify({completed:[...completed],engine})); } catch { /* Navigation remains usable without storage. */ } }
const expandIcon = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function media(src, alt, points = [], caption = '') {
  const data = JSON.stringify(points).replaceAll('"','&quot;');
  return `<div class="stage"><button class="expand" data-zoom>${expandIcon}크게 보기</button><div class="media-wrap" data-points="${data}"><img src="assets/${src}" alt="${alt}" loading="eager"><canvas aria-hidden="true"></canvas></div></div>${caption ? `<p class="caption">${caption}</p>` : ''}`;
}
function enginePicker() {
  return `<fieldset class="engine"><legend>마비노기 → 환경설정 → 실험실 → 렌더링 엔진(Vulkan)<br>이 항목에 체크되어 있나요?</legend><div class="engine-options"><label><input name="engine" type="radio" value="vulkan" ${engine==='vulkan'?'checked':''}>켜짐 · 체크되어 있음</label><label><input name="engine" type="radio" value="dx9" ${engine==='dx9'?'checked':''}>꺼짐 · 체크되어 있지 않음</label></div></fieldset>`;
}
const pages = [
  () => ({title:'AMD도 사용할 수 있어요',lead:'한 번에 하나씩 따라오세요. 먼저 게임의 그래픽 설정을 확인합니다.',html:`<div class="intro"><h2>ReShade는 화면에 입히는 필터예요</h2><p>색을 조금 더 선명하게 하거나 화면의 대비를 바꿀 수 있어요. <strong>AMD 전용 파일은 따로 필요하지 않습니다.</strong> NVIDIA도 같은 설치 프로그램을 사용합니다.</p><p>이번 안내는 무료 효과만 사용합니다. 유료 프리셋이나 추가 프로그램은 필요하지 않아요.</p></div><ol class="instructions"><li>게임에서 <strong>환경설정 → 실험실</strong>을 열어요.</li><li><strong>렌더링 엔진(Vulkan)</strong>에 체크가 되어 있는지 확인하세요. 설정은 바꾸지 않아도 돼요.</li><li>아래에 현재 상태를 표시한 뒤, 게임을 정상 종료하세요.</li></ol>${enginePicker()}<p class="note">설치할 때는 게임이 꺼져 있어야 해요. 지금 선택한 값에 맞춰 4단계의 안내가 바뀝니다. 별도로 DXVK를 설치해 사용한다면 Vulkan을 고르세요.</p><p class="caption">실제 캡처: NVIDIA + Vulkan 환경. AMD PC에서 직접 테스트한 결과는 아니며, 그래픽카드·드라이버·게임 업데이트에 따라 동작이 달라질 수 있습니다. 자세한 근거는 위의 ‘출처’에서 확인하세요.</p>`}),
  () => ({title:'공식 파일을 받으세요',lead:'reshade.me에서 ‘Download ReShade’라고 적힌 일반 버전을 받아요.',html:`<a class="button primary" href="https://reshade.me/#download" target="_blank" rel="noopener noreferrer">공식 다운로드 페이지 열기</a>${media('official-download.png','ReShade 공식 다운로드 영역. 일반 버전과 full add-on support 버전 버튼이 보입니다.',[{x:.596,y:.75,label:'위쪽 일반 버전'}],'2026.09.25 실제 공식 사이트 캡처 · 화면의 버전 숫자는 나중에 바뀔 수 있어요.')}<ol class="instructions"><li>페이지 아래 <strong>Download</strong> 구역을 찾으세요. 광고의 다운로드 버튼과 구분하세요.</li><li><strong>Download ReShade 6.8.0</strong>처럼 버전 숫자로 끝나는 버튼을 눌러요. <strong>with full add-on support</strong>가 붙은 버튼은 이번 안내에서 쓰지 않아요.</li><li>다운로드한 <code>ReShade_Setup_…exe</code>를 실행하세요.</li></ol>`}),
  () => ({title:'마비노기 실행 파일을 고르세요',lead:'목록에서 못 찾아도 괜찮아요. Browse…로 직접 선택할 수 있어요.',html:`${media('client-path.png','설치 도구 하단에서 C:\\Nexon\\Mabinogi\\Client.exe가 선택된 모습.',[{x:.87,y:.30,label:'파일 찾기'},{x:.64,y:.81,label:'선택 후 Next'}],'')}<ol class="instructions"><li><strong>Browse…</strong> 버튼을 누르세요.</li><li>마비노기가 설치된 폴더를 열고 <strong>Client.exe</strong>를 선택하세요.</li><li>선택된 경로 끝이 <strong>Client.exe</strong>인지 확인하고 <strong>Next</strong>를 누르세요.</li></ol><p class="note">흔한 설치 위치는 <code>C:\\Nexon\\Mabinogi\\Client.exe</code>입니다. 다른 드라이브에 설치했다면 위치가 달라요. 바탕화면 바로가기나 넥슨 런처 파일이 아니라, 마비노기 폴더 안의 Client.exe를 선택하세요.</p>`}),
  () => ({title:'그래픽 방식을 선택하세요',lead:engine==='vulkan'?'Vulkan 설정이 켜져 있으므로, Vulkan을 선택해요.':engine==='dx9'?'Vulkan 설정이 꺼져 있으므로, DirectX 9를 선택해요.':'1단계에서 확인한 Vulkan 설정에 맞춰 선택해요.',html:`${enginePicker()}${media('api-vulkan.png','ReShade 그래픽 방식 선택 화면. DirectX 9, DirectX 10/11/12, OpenGL, Vulkan 선택지가 있습니다.',engine?[{x:.227,y:engine==='vulkan'?.674:.291,label:engine==='vulkan'?'Vulkan 선택':'DirectX 9 선택'}]:[],'실제 캡처는 Vulkan이 선택된 예시입니다. 꺼짐을 선택했다면 위쪽 DirectX 9의 원을 클릭하세요.')}<p class="instruction">${engine?'<strong>'+(engine==='vulkan'?'Vulkan':'DirectX 9')+'</strong>'+(engine==='vulkan'?'을':'를')+' 선택한 뒤 <strong>Next</strong>를 누르세요.':'위에서 켜짐 또는 꺼짐을 선택하면 눌러야 할 위치가 표시됩니다.'}</p><p class="note">AMD라서 DirectX 12를 고르는 것이 아니에요. <strong>게임의 그래픽 방식</strong>에 맞춰야 합니다. 처음 선택되어 있는 항목도 자동 추측일 수 있어요. Windows 권한 확인 창이 나오면 ReShade 설치 프로그램인지 확인하고 직접 진행하세요.</p>`}),
  () => ({title:'기본 효과 두 묶음만 설치해요',lead:'Standard effects와 SweetFX를 선택하고 Next를 누르세요.',html:`${media('effects.png','Standard effects와 SweetFX by CeeJay.dk가 선택된 효과 설치 화면.',[{x:.074,y:.217,label:'기본 효과'},{x:.074,y:.291,label:'SweetFX'}],'실제 설치 화면 · 기본 선택 상태라면 그대로 진행하면 됩니다.')}<ol class="instructions"><li><strong>Standard effects</strong>와 <strong>SweetFX by CeeJay.dk</strong>를 선택하세요.</li><li>프리셋을 묻는 칸은 비워 두고 <strong>Next</strong>를 누르세요.</li><li>추가 효과 선택 화면이 나오면 기본값으로 진행하세요.</li><li>초록색 체크와 <strong>Successfully installed ReShade</strong>가 나오면 <strong>Finish</strong>를 누르세요.</li></ol><details class="trouble"><summary>설치 완료 화면 보기</summary>${media('success.png','ReShade 설치 성공 화면과 Finish 버튼.',[{x:.645,y:.96,label:'설치 마침'}])}</details>`}),
  () => ({title:'게임에서 Home을 눌러 보세요',lead:'평소 방법으로 마비노기를 실행하고, 설치 성공 안내를 확인해요.',html:`${media('game-banner.png','게임 위쪽에 표시된 ReShade 설치 성공 안내와 Home 키 안내.',[],'')}<ol class="instructions"><li>게임 화면 위쪽에 <strong>ReShade</strong>와 설치 성공 안내가 뜨는지 확인하세요.</li><li>게임 화면을 클릭한 뒤 키보드의 <kbd>Home</kbd>을 누르세요. 노트북은 <kbd>Fn</kbd>과 함께 눌러야 할 수도 있어요.</li><li>첫 사용 안내가 나오면 화면의 계속 버튼으로 진행하거나 튜토리얼을 건너뛰세요.</li><li>설정창이 열리면 설치 확인이 끝났어요. <kbd>Home</kbd>을 다시 누르면 닫힙니다.</li></ol><p class="note">설치 성공 안내가 없거나 Home을 눌러도 열리지 않으면 마지막 단계의 ‘설정창이 안 열려요’를 확인하세요.</p>`}),
  () => ({title:'색감은 조금만 올려 보세요',lead:'처음에는 Vibrance 하나만 켜면 차이를 확인하기 쉬워요.',html:`<div class="intro"><h2>Vibrance = 색의 생기를 조절하는 효과</h2><p><strong>0.10</strong>부터 시작해 보세요. 0에 가까울수록 변화가 작고, 값을 올릴수록 색이 진해집니다. 화면이나 취향에 맞춰 조절하면 돼요.</p></div><ol class="instructions"><li><kbd>Home</kbd>으로 ReShade 창을 열어요.</li><li>효과 목록에서 <strong>Vibrance</strong>를 찾거나 검색창에 입력해요.</li><li>이름 왼쪽 체크박스를 켜고, 아래 설정의 <strong>Vibrance</strong> 값을 <strong>0.10</strong> 정도로 맞추세요.</li><li>체크를 껐다 켰다 하면서 차이를 비교하세요. 마음에 들면 켜 둡니다.</li><li><kbd>Home</kbd>으로 창을 닫으면 게임을 계속할 수 있어요.</li></ol><p class="note">글씨와 메뉴의 색도 함께 바뀔 수 있어요. 너무 진하면 값을 낮추거나 체크를 해제하세요. 처음에는 깊이 정보가 필요한 흐림·입체 그림자 효과를 추가하지 않아도 됩니다.</p>`}),
  () => ({title:'막히면 여기부터 확인하세요',lead:'문제에 맞는 항목을 펼쳐 보세요. 원래 화면으로 되돌리는 방법도 있어요.',html:`<details class="trouble"><summary>설정창이 안 열려요</summary><ol><li>게임을 완전히 종료한 상태에서 설치했는지 확인하세요.</li><li>게임 폴더의 <strong>Client.exe</strong>를 선택했는지 확인하세요.</li><li>게임의 Vulkan 설정과 설치 도구의 선택이 일치하는지 확인하세요.</li><li>게임 화면을 클릭한 뒤 Home을 누르세요. 노트북은 Fn + Home을 확인하세요.</li></ol><p>버전이나 보안 모듈 문제일 수도 있습니다. 보안 프로그램을 끄거나 우회하지 말고, 아래 제거 방법으로 되돌리세요.</p></details><details class="trouble"><summary>게임이 느려지거나 색이 너무 진해요</summary><p>ReShade 창에서 Vibrance 체크를 꺼 비교해 보세요. 여러 효과를 켰다면 하나씩 꺼 보세요. 프레임 저하가 지속되면 ReShade를 제거한 상태와 비교하세요.</p></details><details class="trouble"><summary>Vibrance가 안 보여요 / 효과에 오류가 떠요</summary><p>검색어를 지운 뒤 다시 확인하세요. 설치 프로그램에서 같은 Client.exe와 그래픽 방식을 고르고 효과 수정 기능으로 SweetFX가 설치되었는지 확인하세요. 다운로드 실패라면 인터넷 연결을 확인한 후 다시 설치하세요.</p></details><details class="trouble"><summary>게임 업데이트 후 안 되거나 실행이 안 돼요</summary><p>게임을 종료하고 아래 절차로 ReShade를 먼저 제거하세요. 원래 게임이 실행되는지 확인한 뒤, 업데이트된 그래픽 방식과 ReShade 호환성을 다시 확인하세요. 기존 게임 파일이나 d3d9_dxvk.dll을 임의로 삭제하지 마세요.</p></details><details class="trouble"><summary>완전히 제거하고 원래대로 되돌리기</summary><ol><li>마비노기를 정상 종료하세요.</li><li>공식 ReShade 설치 프로그램을 다시 실행하세요.</li><li>설치 때와 같은 <strong>Client.exe</strong>와 그래픽 방식(Vulkan 또는 DirectX 9)을 선택하세요.</li><li><strong>Uninstall</strong> 또는 <strong>Uninstall ReShade and effects</strong>를 선택하고 진행하세요.</li><li>게임을 다시 실행해 ReShade 안내가 사라졌는지 확인하세요.</li></ol><p>Vulkan 설치는 게임 폴더 밖에도 구성요소가 생기므로 설치 도구로 제거하는 방법이 가장 분명합니다.</p></details><p class="note">이 페이지의 완료 체크와 그래픽 방식 선택은 이 브라우저 안에만 저장돼요. 가이드의 버튼은 실제 게임 설정을 바꾸지 않습니다.</p><p class="finished" id="all-done"></p>`})
];
function drawAnnotation(wrap) {
  const img=wrap.querySelector('img'),canvas=wrap.querySelector('canvas');
  if(!img.complete || !img.naturalWidth) return;
  const width=img.clientWidth,height=img.clientHeight,dpr=window.devicePixelRatio||1;
  if(!width || !height) return;
  canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr);
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const points=JSON.parse(wrap.dataset.points||'[]');
  points.forEach(p=>{
    const x=p.x*width,y=p.y*height,r=Math.max(9,Math.min(17,width*.035));
    ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#246c51';ctx.lineWidth=3;ctx.stroke();
    const size=Math.max(11,Math.min(14,width*.033));ctx.font=`700 ${size}px "Malgun Gothic",sans-serif`;
    const tw=ctx.measureText(p.label).width+18,th=size+13;
    let bx=x+r+14;if(bx+tw>width-4)bx=x-r-14-tw;
    const by=Math.min(Math.max(4,y-th/2),height-th-4);
    ctx.beginPath();ctx.moveTo(x+(bx>x?r:-r),y);ctx.lineTo(bx>x?bx:bx+tw,by+th/2);ctx.stroke();
    ctx.fillStyle='#245d4b';ctx.fillRect(bx,by,tw,th);ctx.fillStyle='white';ctx.textBaseline='middle';ctx.fillText(p.label,bx+9,by+th/2);
  });
}
const originalColorPage=pages[6];
pages[6]=()=>{const page=originalColorPage();page.html=media('vibrance-enabled.png','검색 결과의 Vibrance 체크가 켜진 실제 게임 설정 화면.',[],'실제 게임에서 활성화 상태를 확인했습니다.')+media('vibrance-value.png','Vibrance 값 0.100이 표시된 실제 게임 설정 화면.',[],'')+page.html+`<details class="trouble"><summary>같은 설정 파일을 받아서 쓰고 싶어요</summary><p><a class="button secondary" href="Mabinogi-Soft.zip" download="Mabinogi-Soft.zip">약한 색감 설정 받기 (.zip)</a></p><ol><li>받은 <strong>Mabinogi-Soft.zip</strong>을 마우스 오른쪽 버튼으로 누르고 <strong>압축 풀기</strong>를 선택하세요.</li><li>안에 있는 <strong>Mabinogi-Soft.ini</strong>를 마비노기 설치 폴더에 넣으세요. 기존 파일을 덮어쓸 필요는 없어요.</li><li>ReShade 창 맨 위의 프리셋 선택 부분에서 <strong>Mabinogi-Soft.ini</strong>를 선택하세요.</li><li>Vibrance 체크와 값 <strong>0.100</strong>을 확인하세요. SweetFX가 먼저 설치되어 있어야 해요.</li></ol><p>이 파일에는 색감 수치만 들어 있습니다. ReShade나 효과 파일은 포함하지 않아요.</p></details>`;return page};
const basicColorPage=pages[6];
pages[6]=()=>{
  const page=basicColorPage();
  page.title='벨밋의 테스트 프리셋';
  page.lead='밝고 부드러운 그림자와 따뜻한 색감으로, 차분한 스크린샷 분위기를 만들어 보세요.';
  page.html=`<section class="intro" aria-labelledby="belmit-preset-title"><h2 id="belmit-preset-title">벨밋의 테스트 프리셋</h2><p><strong>제작자 · 류트@벨밋</strong></p><p>어두운 부분을 밝게 들어 올리고 따뜻한 색감을 더했습니다. 강한 대비를 낮추고 윤곽의 계단 현상을 부드럽게 줄이는 조합이에요.</p><p><a class="button primary" href="Belmit-Test.zip?v=220100" download="Belmit-Test.zip">벨밋의 테스트 프리셋 받기 (.zip)</a></p><ol class="instructions"><li>5단계에서 <strong>SweetFX</strong>를 설치하세요.</li><li>받은 <strong>Belmit-Test.zip</strong>을 마우스 오른쪽 버튼으로 누르고 <strong>압축 풀기</strong>를 선택하세요.</li><li>압축을 푼 폴더 안의 <strong>Belmit-Test.ini</strong>를 마비노기 설치 폴더에 넣으세요.</li><li><kbd>Home</kbd>으로 ReShade를 열고, 아래 화면처럼 <strong>Belmit-Test.ini</strong>를 선택하세요.</li><li><strong>LiftGammaGain · Tonemap · Vibrance · Curves · FXAA</strong> 5개 효과가 켜졌는지 확인하세요.</li></ol><p>글씨가 흐릿해지면 <strong>FXAA</strong>만 끄세요. 기존 색감으로 돌아가려면 이전에 쓰던 프리셋을 다시 선택하면 돼요.</p><p class="caption">v1.0 검토본 · 색감 조합을 만든 상태이며 게임 내 최종 색감은 아직 확인하지 않았습니다. 장소와 시간대, 모니터에 따라 결과가 달라질 수 있어요.</p></section><section aria-labelledby="preset-select-title"><h2 id="preset-select-title">화면에서 프리셋 선택하기</h2>${media('preset-select.png','ReShade 맨 위 프리셋 목록을 열고 Belmit-Test.ini를 고른 뒤 아래 선택 버튼을 누르는 화면.',[{x:.25,y:.151,label:'1 목록'},{x:.35,y:.746,label:'2 파일'},{x:.594,y:.916,label:'3 선택'}])}<ol class="instructions"><li>맨 위의 <strong>현재 프리셋 이름</strong>을 클릭하세요. 처음에는 <strong>ReShadePreset</strong>처럼 다른 이름일 수 있어요.</li><li>열린 목록에서 <strong>Belmit-Test.ini</strong>를 클릭하세요.</li><li>아래쪽 <strong>선택</strong> 버튼을 누르세요. 맨 위 이름이 <strong>Belmit-Test</strong>로 바뀌면 선택이 끝났어요.</li></ol><p class="note">파일이 안 보이면 ZIP의 압축을 풀었는지, <strong>Belmit-Test.ini</strong>를 <strong>Client.exe가 있는 폴더</strong>에 넣었는지 확인하세요. 목록 위 경로도 같은 폴더여야 해요. 사진의 <strong>C:\\Nexon\\Mabinogi</strong>는 예시이며 PC마다 다를 수 있어요.</p></section><p class="note">이 프리셋은 색감과 윤곽을 조절합니다. 배경만 흐리는 효과(심도 흐림)는 포함하지 않습니다. 온라인 표준 버전은 깊이 정보 접근이 제한될 수 있어요. <a href="https://reshade.me/" target="_blank" rel="noopener noreferrer">ReShade 공식 안내</a></p><h2>직접 색감을 조절하고 싶다면</h2><p>아래는 Vibrance 하나로 시작하는 기본 예시입니다.</p>`+page.html;
  return page;
};
const presetPage=pages[6];
pages[6]=()=>{
  const page=presetPage();
  const comparison=`<section class="comparison" aria-labelledby="compare-title"><h2 id="compare-title">벨밋의 실제 적용 전 · 후</h2><p class="caption">같은 순간에 저장한 게임 화면입니다. 아래 막대를 좌우로 움직여 비교하세요.</p><div class="compare-frame" style="--reveal:50%"><img src="assets/belmit-after.png?v=220100" width="1400" height="1350" alt="벨밋의 테스트 프리셋 적용 후 캐릭터와 풍경"><img class="compare-before" src="assets/belmit-before.png?v=220100" width="1400" height="1350" alt="같은 장면의 ReShade 적용 전 화면"><span class="compare-divider" aria-hidden="true"></span><span class="compare-label before-label">적용 전</span><span class="compare-label after-label">적용 후</span></div><label class="compare-slider-label" for="compare-slider">전후 비교 막대</label><input id="compare-slider" type="range" min="0" max="100" value="50" aria-valuetext="적용 전 50%, 적용 후 50%"><div class="compare-actions"><button class="button secondary" data-compare="100">적용 전만 보기</button><button class="button secondary" data-compare="0">적용 후만 보기</button></div><p class="caption">벨밋의 테스트 프리셋 · 제작자 류트@벨밋<br><a href="assets/belmit-before.png?v=220100" target="_blank" rel="noopener noreferrer">적용 전 사진 열기</a> · <a href="assets/belmit-after.png?v=220100" target="_blank" rel="noopener noreferrer">적용 후 사진 열기</a></p></section>`;
  page.html=comparison+page.html.replace('색감 조합을 만든 상태이며 게임 내 최종 색감은 아직 확인하지 않았습니다.','NVIDIA + Vulkan 환경에서 적용과 전후 촬영을 확인했습니다.');
  const photoGuide=`<details class="trouble"><summary>게임 UI 없이 전후 사진 찍기</summary><ol class="instructions"><li>게임 화면에서 <kbd>₩ (\\)</kbd> 키를 눌러 메뉴와 채팅창을 숨기세요. 다시 누르면 돌아옵니다.</li><li>캐릭터 이름도 숨기고 싶다면 <kbd>Ctrl</kbd> + <kbd>N</kbd>을 누르세요. 이름을 남기려면 생략해도 돼요.</li><li>ReShade의 <strong>설정 → 스크린샷</strong>에서 <strong>이펙트 적용 전후 이미지 함께 저장</strong>을 켜세요.</li><li><strong>오버레이 표시 이미지 함께 저장</strong>은 꺼 두세요. ReShade 설정창을 열어 둬도 설정창 없는 사진이 저장됩니다.</li><li>같은 화면에서 설정된 <strong>스크린샷 키</strong>를 한 번 누르세요. 기본값은 <kbd>Print Screen</kbd>입니다. 저장 위치는 바로 아래 <strong>스크린샷 경로</strong>에서 확인할 수 있어요.</li></ol><p>Windows 캡처 도구가 열리면 ReShade의 스크린샷 키 칸을 클릭하고 다른 단축키를 지정하세요.</p><p class="caption">단축키를 바꾼 적이 있다면 게임의 환경설정에서 확인하세요. <a href="https://mabinogi.nexon.com/page/news/notice_view.asp?id=4886831" target="_blank" rel="noopener noreferrer">모든 창 숨김 공식 안내</a> · <a href="https://mabinogi.nexon.com/page/archive/guide_view.asp?id=4892961&num=5" target="_blank" rel="noopener noreferrer">단축키 공식 가이드</a></p></details>`;
  page.html=page.html.replace('<h2>직접 색감을 조절하고 싶다면</h2>',photoGuide+'<h2>직접 색감을 조절하고 싶다면</h2>');
  return page;
};
const observer=new ResizeObserver(entries=>entries.forEach(e=>drawAnnotation(e.target)));
function wireMedia(root) {
  root.querySelectorAll('.media-wrap').forEach(wrap=>{wrap.querySelector('img').addEventListener('load',()=>drawAnnotation(wrap));observer.observe(wrap);drawAnnotation(wrap)});
  root.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{
    $('#zoom-media').replaceChildren(button.parentElement.querySelector('.media-wrap').cloneNode(true));
    $('#zoom-title').textContent=labels[step]+' · 크게 보기';$('#zoom-dialog').showModal();wireMedia($('#zoom-media'));
  }));
}
function updateProgress() {
  $('#progress').textContent=`${completed.size} / 8 단계 완료`;$('#progress-bar').value=completed.size;
  document.querySelectorAll('.step').forEach((button,i)=>{button.classList.toggle('completed',completed.has(i));button.querySelector('.step-number').textContent=completed.has(i)?'✓':String(i+1);button.setAttribute('aria-label',`${i+1}. ${labels[i]}${completed.has(i)?' (완료)':''}`)});
  const end=$('#all-done');if(end)end.textContent=completed.size===8?'8단계를 모두 확인했어요. 즐거운 에린 생활 되세요.':`${completed.size} / 8 단계 완료 · 필요한 단계는 언제든 다시 볼 수 있어요.`;
}
function render(focus=false) {
  observer.disconnect();const page=pages[step]();$('#title').textContent=page.title;$('#lead').textContent=page.lead;$('#content').innerHTML=page.html;
  document.querySelectorAll('.step').forEach((button,i)=>{button.classList.toggle('active',i===step);if(i===step)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')});
  $('#mobile-step').value=String(step);$('#done').checked=completed.has(step);$('#previous').disabled=step===0;$('#next').disabled=step===7;
  $('#next').innerHTML=step===7?'마지막 단계':'다음 단계 <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.querySelectorAll('input[name=engine]').forEach(input=>input.addEventListener('change',()=>{engine=input.value;persist();render()}));
  const slider=$('#compare-slider');
  if(slider){
    const updateComparison=()=>{
      const value=Number(slider.value),frame=$('.compare-frame');
      frame.style.setProperty('--reveal',`${value}%`);
      frame.querySelector('.before-label').hidden=value===0;
      frame.querySelector('.after-label').hidden=value===100;
      slider.setAttribute('aria-valuetext',`적용 전 ${value}%, 적용 후 ${100-value}%`);
    };
    slider.addEventListener('input',updateComparison);
    document.querySelectorAll('[data-compare]').forEach(button=>button.addEventListener('click',()=>{slider.value=button.dataset.compare;updateComparison()}));
  }
  wireMedia($('#content'));updateProgress();document.title=`${labels[step]} · 마비노기 ReShade 가이드`;
  if(focus){$('#main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'})}
}
function navigate(index){location.hash=`step-${Math.max(0,Math.min(7,index))+1}`}
function readHash(){const match=location.hash.match(/^#step-([1-8])$/);step=match?Number(match[1])-1:0;render(true)}
$('#steps').innerHTML=labels.map((label,i)=>`<button class="step" data-step="${i}"><span class="step-number" aria-hidden="true">${i+1}</span><span>${label}</span></button>`).join('');
$('#mobile-step').innerHTML=labels.map((label,i)=>`<option value="${i}">${i+1}. ${label}</option>`).join('');
$('#steps').addEventListener('click',event=>{const b=event.target.closest('[data-step]');if(b)navigate(Number(b.dataset.step))});
$('#mobile-step').addEventListener('change',event=>navigate(Number(event.target.value)));
$('#previous').addEventListener('click',()=>navigate(step-1));$('#next').addEventListener('click',()=>navigate(step+1));
$('#done').addEventListener('change',event=>{if(event.target.checked)completed.add(step);else completed.delete(step);persist();updateProgress()});
$('#reset').addEventListener('click',()=>{completed.clear();persist();$('#done').checked=false;updateProgress()});
$('#help').addEventListener('click',()=>navigate(7));$('#sources').addEventListener('click',()=>$('#sources-dialog').showModal());
$('#close-sources').addEventListener('click',()=>$('#sources-dialog').close());$('#close-zoom').addEventListener('click',()=>$('#zoom-dialog').close());
window.addEventListener('hashchange',readHash);readHash();
