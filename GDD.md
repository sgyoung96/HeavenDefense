# Heaven Defense (헤븐 디펜스)

Game Design Document | Version 1.1 | 2026-11-25

정식 출시용 완성형 게임 기획서. 별도 MVP 제작 없이 하나의 정식 프로젝트에서 시스템별로 구현하고 검증한다. 게임명과 천국 배경은 확정이며 콘텐츠 수량, 수치 및 기술 스택은 가안이다.

## 1. 게임 개요

| 항목 | 내용 |
|---|---|
| 게임명 | 헤븐 디펜스 (Heaven Defense) |
| 프로젝트명 | heaven-defense |
| 개발 목표 | 정식 출시용 완성형 인디 게임 |
| 세계관 | 천국 |
| 장르 | 뱀서라이크 + 성 디펜스 + 펫 수집 RPG |
| 플랫폼 | WebGL 기반 웹 브라우저, 싱글 플레이 (PC 및 터치 기기) |
| 그래픽 | 3D 복셀 환경 + 32px 픽셀아트 캐릭터 |
| 화면 | 세로 모드, 9:16 기준, 전체 화면, 3인칭 쿼터뷰 |
| 조작 | 가상 조이스틱 또는 WASD, 마우스 및 터치 |
| 전투 | 기본 자동 공격 + 수동 특수 스킬 |
| 플레이 시간 | 스테이지당 약 10~15분 |

천국의 수호 마법사가 되어 몬스터를 물리치고 펫을 수집하며 성을 지킨다. 핵심 재미는 대량 처치, 무작위 스킬 조합, 펫 수집, 천국 성장, 아름다운 세계의 탐험이다.

## 2. 아트 디렉션

HD-2D 스타일: 3D 복셀 지형과 건축물, 2D 픽셀 스프라이트의 조합. 분홍색과 하늘색 구름, 초원, 대지, 꽃, 강, 폭포, 중앙의 백색 중세풍 성, 파란 지붕과 황금빛 장식. 금발 여성 마법사와 무지개 갈기의 흰 유니콘, 파스텔 슬라임.

| 색상 | HEX |
|---|---|
| 신성한 백색 | #FFF8E7 |
| 천상의 황금빛 | #F6D98B |
| 구름 | #F8C5E2 |
| 하늘 | #B4DFFF |
| 신비로운 보라빛 | #D9CCF5 |
| 초원 | #C6E8B7 |
| 대지 | #F3D3AA |
| 강 | #75B9E8 |
| 성 지붕 | #6F87C8 |

| 리소스 | 규격 |
|---|---|
| 플레이어, 일반 적, 펫 | 32×32px 스프라이트 |
| 보스 | 64×64px 이상 |
| 지형 텍스처 | 32×32px |
| 스킬 아이콘 | 64×64px |
| 건축물 | 3D Voxel, 가변 크기 |

구름 이동, 풀과 꽃의 흔들림, 강과 폭포 흐름, 마법 입자, 피격 플래시, 사망 픽셀 분해, 황금빛 레벨업, 무지개빛 희귀 펫 등장 연출.

## 3. 세계관

분홍빛과 하늘빛 구름이 끝없이 펼쳐진 천국. 꽃이 만발한 대지와 생명수가 흐르는 강, 신비로운 생명체가 살아가는 평화로운 세계다. 중앙의 신성한 성은 천국의 생명력을 유지한다. 정체불명의 슬라임들이 나타나 평화를 위협하고, 플레이어는 천국의 수호자로서 천상의 펫과 함께 성을 지킨다. 구체적인 종교적 교리나 신의 설정은 미확정이다.

슬로건: 아름다운 천국, 당신의 손으로 지켜주세요.

## 4. 핵심 게임 루프

- 인게임: 입장 → 몬스터 생성 → 자동 전투 → 경험치 획득 → 레벨업 → 스킬 선택 → 웨이브 클리어.
- 아웃게임: 클리어 보상 → 펫 수집 → 캐릭터 강화 → 성 강화 → 다음 스테이지.
- 인게임 성장과 영구 성장은 분리한다.

## 5. 플레이어 시스템

금발, 파란 리본, 흰색과 파란색 의상, 수정 지팡이를 사용하는 여성 원거리 마법사.

| 능력치 | 초기값 |
|---|---:|
| HP / MP | 100 / 100 |
| 공격력 / 방어력 | 10 / 5 |
| 이동속도 | 4 유닛/초 |
| 공격 간격 | 1초 |
| 사거리 | 6 유닛 |
| 치명타 확률 / 배율 | 5% / 150% |
| 경험치 획득 반경 | 2 유닛 |

| 입력 | 기능 |
|---|---|
| WASD / 방향키 | 이동 |
| 좌측 하단 가상 조이스틱 | 터치 또는 마우스 드래그로 이동 |
| Q / E / R | 특수 스킬 1 / 2 / 궁극기 |
| ESC | 일시정지 |
| I / P | 인벤토리 / 펫 정보 |
| 마우스 | UI 및 스킬 선택, 휠 줌 |

반투명 가상 조이스틱을 지원하며 수동 기본 공격 버튼은 없다. 키보드와 조이스틱은 동일한 이동 로직을 사용하고 대각선 이동속도를 정규화한다. 4방향 애니메이션: Idle 4, Walk 6, Attack 6, Cast 6, Hit 2, Death 6, Level Up 6 프레임.

## 6. 전투 시스템

사거리 내 가장 가까운 적을 자동 공격하며 공격 중에도 이동 가능하다. 자동 공격은 MP를 소모하지 않는다.

| 자동 스킬 | 효과 |
|---|---|
| 마력 구체 | 가장 가까운 적에게 마법탄 |
| 얼음 화살 | 피해 및 감속 |
| 회전 수정 | 주변을 회전하며 피해 |
| 번개 사슬 | 연쇄 피해 |
| 불꽃 장판 | 지속 범위 피해 |
| 별빛 낙하 | 무작위 적 위치 광역 피해 |
| 바람 칼날 | 관통 투사체 |
| 수호의 빛 | 주변 적 주기적 피해 |

| 특수 스킬 | 키 | MP | 쿨타임 | 효과 |
|---|---|---:|---:|---|
| 마력 소용돌이 | Q | 20 | 15초 | 적을 끌어당기고 지속 피해 |
| 별빛 폭격 | E | 30 | 25초 | 적 밀집 지역 폭격 |
| 태양의 심판 | R | 50 | 60초 | 강력한 광역 궁극기 |

MP 자연 회복 및 회복 아이템 드롭. MP 부족 또는 쿨타임 중 사용 불가.

## 7. 레벨업 시스템

몬스터가 드롭한 경험치 결정에 접근하면 자동 획득한다. 레벨업 시 전투를 일시정지하고 무작위 강화 카드 3장 중 하나를 선택한다. 신규 스킬, 스킬 강화, 공격력, 공격속도, 이동속도, 최대 HP, MP 회복, 경험치 획득 범위 강화가 가능하다.

자동 스킬 최대 6개, 각 최대 5레벨. 마력 구체 예시: Lv1 기본 1발 → Lv2 피해 +20% → Lv3 투사체 +1 → Lv4 공격 간격 -20% → Lv5 관통. 스테이지 종료 시 인게임 성장 초기화.

## 8. 디펜스 시스템

성 HP 1000, 방어력 10, 기본 공격 및 자동 회복 없음. 추적형 적은 플레이어를, 공성형 적은 성을 공격한다. 원거리형, 돌진형, 보스형도 존재한다. 경험치 수집을 위해 성에서 멀어지는 행동에는 위험이 따른다.

- 승리: 최종 웨이브 보스 및 잔여 적 모두 처치.
- 패배: 플레이어 또는 성 HP가 0.
- 영구 강화: 성벽 HP, 마법 결계 방어력, 수호 수정 아군 강화, 마법 포탑, 회복의 샘. 모든 강화 항목을 정식 출시 범위에 포함한다.

## 9. 펫 시스템

| 펫 | 등급 | 패시브 | 자동 능력 |
|---|---|---|---|
| 유니콘 | 전설 | MP 회복 +20% | 플레이어 HP 회복 |
| 아기 드래곤 | 영웅 | 공격력 +10% | 화염 브레스 |
| 달빛 여우 | 영웅 | 이동속도 +10% | 주변 적 빙결 |
| 황금 슬라임 | 희귀 | 골드 +15% | 경험치 결정 수집 |
| 꽃잎 토끼 | 일반 | 경험치 +5% | 꽃잎 발사 |

알 부화 등급 확률 가안: 일반 50%, 희귀 30%, 영웅 15%, 전설 4.5%, 신화 0.5%. 신화 펫 추가 전에는 확률표를 적용하지 않는다. 최초 클리어, 보스, 도감, 알 부화, 숨겨진 이벤트로 획득. 유료 확률형 상품 미도입.

펫 성장: 레벨, 친밀도, 진화, 스킬 강화, 능력치 없는 스킨. 유니콘 진화: 아기 → 빛의 유니콘 → 천상의 유니콘.

펫 AI: 플레이어 측후방 추적, 일정 거리 이상 멀어지면 순간이동, 자동 스킬, 지형 이동 제한 및 적의 공격 대상에서 제외. 동행 1마리, 유니콘 기본 제공을 가안으로 한다. 수집과 진화는 정식 출시 기능이다.

## 10. 몬스터 시스템

| 몬스터 | HP | 공격력 | 이동속도 | EXP | 특징 |
|---|---:|---:|---:|---:|---|
| 블루 슬라임 | 20 | 5 | 1.5 | 5 | 추적형 |
| 핑크 슬라임 | 15 | 4 | 2.5 | 5 | 고속 이동 |
| 포이즌 슬라임 | 35 | 8 | 1.2 | 10 | 독 장판 |
| 파이어 슬라임 | 40 | 15 | 1.8 | 12 | 사망 폭발 |
| 매직 슬라임 | 30 | 10 | 1.0 | 15 | 원거리 |
| 스톤 슬라임 | 100 | 20 | 0.8 | 25 | 공성형 |

슬라임 킹: HP 5000, 마지막 웨이브 등장, 점프 충격파/소환/광역 장판/성 돌진. 공격 전 경고 영역 표시. 펫 알 및 희귀 재료 보상 기회. 맵 외곽에서 생성하며 동시 생존 적 150마리 제한을 초기 목표로 한다.

## 11. 웨이브 시스템

10웨이브, 각 60초 생성 후 잔여 적 처치, 웨이브 사이 10초 정비. 정비 중 경험치 수집, HP/MP 일부 회복, 다음 공격 방향 확인. 최종 보스 및 잔여 적 처치 시 종료.

| Wave | 생성 수 | 특징 |
|---|---:|---|
| 1 | 10 | 기본 조작 |
| 2 | 15 | 고속 적 |
| 3 | 25 | 공성형 |
| 4 | 35 | 원거리형 |
| 5 | 45 | 중간 보스 |
| 6 | 60 | 복합 구성 |
| 7 | 75 | 다방향 공격 |
| 8 | 90 | 강화 적 |
| 9 | 120 | 대규모 러시 |
| 10 | 150 | 최종 보스 |

생성 수는 웨이브 전체 기준 가안이며 보스 포함 여부와 난이도는 테스트로 확정한다.

## 12. 월드 및 맵

| 챕터 | 월드 | 콘셉트 |
|---|---|---|
| 1 | 천상의 정원 | 꽃과 푸른 초원 |
| 2 | 생명수의 강 | 맑은 강과 폭포 |
| 3 | 황금빛 숲 | 황금빛 나무와 정령 |
| 4 | 구름의 낙원 | 구름 위의 섬 |
| 5 | 별빛의 호수 | 별빛이 반사되는 호수 |
| 6 | 천상의 궁전 | 신성한 백색 궁전 |

챕터당 5개 스테이지를 목표로 하며 적은 슬라임 계열의 변형으로 구성한다.

64×64 타일 초기 가안. 중앙 성, 사방 외곽 스폰 지점, 성 앞 플레이어 및 펫 시작 위치. 강과 다리, 나무, 바위 배치. 잔디/대지/꽃밭/돌길/다리는 이동 가능, 강/나무/바위/성은 이동 불가. 꽃밭에는 꽃잎 파티클. 적이 성까지 접근할 수 있는 경로를 확보한다.

## 13. 카메라 시스템

Perspective Camera, 3인칭 쿼터뷰, 하향 40~50도, FOV 45~55도, 플레이어 부드러운 추적, 마우스 휠 줌, 회전 미지원, 보스 및 궁극기 화면 흔들림. 하늘과 성의 아름다움보다 전투 가독성을 우선하여 실제 각도와 시야를 조정한다.

## 14. UI/UX

| 위치 | 요소 |
|---|---|
| 좌상단 | 초상화, 레벨, HP, MP |
| 상단 중앙 | 웨이브, 진행률, 타이머 |
| 우상단 | 골드, 보석, 인벤토리, 설정 |
| 우상단 아래 | 미니맵 |
| 성 상단 | 성 HP |
| 좌하단 | 반투명 가상 조이스틱, 겹치지 않는 동행 펫 아이콘 |
| 하단 중앙 | EXP |
| 우하단 | Q/E/R 특수 스킬 |

특수 스킬은 남은 쿨타임, 단축키, MP 소모량 표시. 사용 가능 시 테두리 발광. 기본 공격 버튼은 없으며, 좌하단에 반투명 조이스틱을 배치한다. 특수 스킬은 터치 및 클릭으로도 발동한다. 화면 흐름: 타이틀 → 천국 로비 → 스테이지 선택 → 전투 → 결과 → 로비. 로비에서 펫 및 캐릭터/성 강화 관리(확장). 출시 시 모든 출시 범위 메뉴는 정상 작동해야 한다.

### 14.1 화면 모드 및 전체 화면

- 세로 모드 전용으로 설계하며 9:16를 기준으로 다양한 세로 화면 비율에 대응한다.
- 사용자가 게임 시작 버튼을 클릭하거나 터치하면 전체 화면(Fullscreen) 전환을 요청한다.
- 지원되는 환경에서는 전체 화면 진입 후 세로 방향 잠금을 요청한다. 세로 화면에서는 기기를 세로로 돌리라는 안내를 표시한다.
- 브라우저가 전체 화면 또는 방향 잠금을 지원하지 않거나 거부하면 세로 뷰포트 최대화 및 전체 화면 재시도 버튼을 제공한다.
- 전체 화면 해제 후 사용자 조작으로 재진입할 수 있도록 한다. HUD는 화면 크기 및 안전 영역에 맞춰 재배치한다.

## 15. 경제 및 보상

| 재화 | 획득 | 사용 |
|---|---|---|
| 골드 | 적 처치, 클리어 | 캐릭터/성 강화 |
| 마력 보석 | 보스, 업적, 최초 클리어 | 희귀 아이템 교환 |
| 펫 알 | 보스, 스테이지 | 펫 획득 |
| 진화석 | 특정 스테이지 | 펫 진화 |
| 경험치 결정 | 적 처치 | 인게임 레벨업 |

기본 클리어, 처치 수, 성 잔여 HP, 최초 클리어, 보스 처치에 따른 보상. 평가: 클리어 1성, 성 HP 50% 이상 2성, 80% 이상 3성. 결과 화면에는 웨이브, 처치 수, 성 HP, 플레이 시간, 보상 표시.

## 16. 영구 성장

인게임 레벨/스킬은 초기화하고 골드, 보석, 펫 레벨/진화, 성 강화 및 캐릭터 영구 강화는 유지한다. 강화 항목: 공격력, 최대 HP/MP, 방어력, 이동속도, 경험치 획득량. 공격력 강화 예시: 최대 20단계, 단계당 +1, 현재 단계 n에서 다음 비용 round(100 × 1.2^n) 골드.

## 17. 사운드 및 VFX

BGM: 타이틀 피아노/오르골, 로비 평화로운 중세풍, 전투 경쾌한 오케스트라, 후반 긴장감, 보스 웅장함, 승리 팡파르, 패배 잔잔한 피아노.

SFX: 마법탄, 피격, 슬라임 점프/사망, 경험치/골드 획득, 레벨업, 특수 스킬, 펫 부화/진화, UI, 성 위험 경고. VFX: 투사체, 폭발, 회복, 소용돌이, 번개, 무지개 입자. 전투 시야를 가리지 않도록 크기와 투명도를 조정한다.

## 18. 기술 설계

권장 후보: macOS, VS Code, TypeScript, Three.js, Vite, HTML/CSS HUD, GLTF/GLB 모델, PNG 스프라이트 시트, Web Audio API, JSON, IndexedDB, Git/GitHub, Cloudflare Pages 등. Video to Game 생성 프로젝트의 실제 스택 확인 후 확정한다.

### 배포 및 브라우저 입력

- 배포 대상: WebGL 기반 웹 게임. Three.js 채택 시 WebGLRenderer를 사용하고 Vite 빌드 결과물을 정적 웹 호스팅에 배포한다. Unity WebGL 빌드로 엔진을 변경한다는 의미는 아니다.
- Fullscreen API의 requestFullscreen()을 사용자 클릭/터치 이벤트에서 호출한다. 지원되는 경우 Screen Orientation API로 landscape 잠금을 요청한다.
- Pointer Events로 가상 조이스틱 및 터치 스킬을 처리하고 WASD 입력과 공통 이동 벡터로 통합한다. 입력 해제, 포커스 상실 시 이동 상태를 초기화한다.
- PC 및 모바일 브라우저의 WebGL, 전체 화면, 방향 잠금 지원 여부를 검증한다.

렌더링: Skybox → 3D World → Billboard Sprite 및 VFX → HTML HUD. 픽셀 텍스처 Nearest Filter 적용.

```text
heaven-defense/
├── public/assets/ (characters, monsters, pets, models, tiles, effects, audio, ui)
├── src/
│   ├── core/ (Game, GameLoop, InputManager, AssetManager)
│   ├── world/ (World, Terrain, Castle, CameraController)
│   ├── entities/ (Player, Monster, Pet, Projectile)
│   ├── systems/ (Combat, Skill, Wave, Level, Collision, Pet, Reward, Save)
│   ├── data/ (monsters.json, skills.json, pets.json, stages.json)
│   ├── ui/
│   ├── styles/
│   └── main.ts
├── index.html
├── package.json
├── README.md
└── GDD.md
```

최적화: Object Pooling, InstancedMesh, Texture Atlas, Spatial Grid, Frustum Culling, Delta Time, Lazy Loading. PC 브라우저 60 FPS 목표, 실제 기기 검증 필요.

## 19. 데이터 설계

밸런스 수치를 JSON으로 분리한다. 예시:

```json
{"id":"slime_blue","name":"Blue Slime","type":"normal","target":"player","hp":20,"attack":5,"moveSpeed":1.5,"attackInterval":1,"exp":5,"gold":2,"sprite":"slime_blue.png"}
```

```json
{"id":"pet_unicorn","name":"Unicorn","rarity":"legendary","role":"support","maxLevel":50,"followDistance":1.5,"passive":{"type":"mp_regen_bonus","value":0.2},"skill":{"type":"heal","value":10,"cooldown":15}}
```

```json
{"id":"magic_orb","name":"Magic Orb","type":"auto","target":"nearest_enemy","damage":10,"cooldown":1,"range":6,"projectileCount":1,"mpCost":0,"maxLevel":5}
```

```json
{"saveVersion":1,"gold":1250,"gems":30,"playerUpgrades":{"attack":3,"hp":2,"mp":1},"castleUpgrades":{"hp":2,"defense":1},"ownedPets":[{"id":"pet_unicorn","level":5,"exp":120,"affinity":30,"evolution":1}],"equippedPet":"pet_unicorn","clearedStages":[{"id":"stage_01","stars":3}]}
```

정식 싱글 플레이 버전은 서버/DB 없이 IndexedDB 로컬 저장을 기본으로 한다. 저장 버전 관리 및 내보내기/가져오기를 지원하는 방향으로 설계한다. 계정, 클라우드 저장, 랭킹은 백엔드 추가 후 구현.

## 20. 정식 출시 콘텐츠 범위

| 콘텐츠 | v1.0 목표 (가안) |
|---|---|
| 월드 / 스테이지 | 6종 / 30개 |
| 캐릭터 | 4종 (마법사, 기사, 궁수, 정령술사) |
| 일반 몬스터 / 보스 | 슬라임 24종 / 6종 |
| 펫 | 30종, 수집·진화·도감 |
| 자동 공격 / 특수 스킬 | 20종 / 12종 |
| 전투 | 레벨업, 성 방어, 웨이브, 보스, 무한 웨이브 |
| 성장 | 캐릭터·성 강화, 성 커스터마이징 |
| 서비스 | 인벤토리, 업적, 일일 퀘스트, 저장 및 불러오기 |
| 완성도 | 튜토리얼, BGM/SFX, 설정, UI 애니메이션 |

콘텐츠 수량은 목표이며 상세 데이터는 별도 설계한다. 별도 MVP는 제작하지 않는다. 모든 출시 기능은 동일한 정식 코드베이스에서 구현한다. 기술 검증은 개발 중 수행하며 별도 출시 제품이 아니다.

## 21. 정식 게임 개발 로드맵

- [ ] Phase 1: 전체 GDD, 아키텍처, 데이터 모델, UI/UX, 아트 규격 확정
- [ ] Phase 2: Image to Video, Video to Game 결과 검증, Three.js 기반 구축, 월드, 카메라, 입력, 리소스 및 상태 관리
- [ ] Phase 3: 캐릭터 이동, 자동 공격, 특수 스킬, 몬스터 AI, 충돌, 레벨업, 성 방어, 웨이브 및 보스
- [ ] Phase 4: 캐릭터 수집, 펫 수집·진화, 인벤토리, 경제, 영구 강화, 성 커스터마이징
- [ ] Phase 5: 6개 월드, 30개 스테이지, 캐릭터·몬스터·펫·스킬 콘텐츠 제작
- [ ] Phase 6: 타이틀, 로비, 도감, 업적, 일일 퀘스트, 무한 웨이브, 저장 및 설정
- [ ] Phase 7: 튜토리얼, 사운드, VFX, UI 연출, 밸런스, 성능 및 호환성 테스트, 배포

출시 검증: 전체 스테이지의 시작부터 승패·보상·저장까지 정상 동작, 저장 후 재접속 시 성장 유지, 모든 출시 메뉴 동작, WASD, 조이스틱, 마우스 및 터치 입력 정상, 사용자 시작 조작 후 전체 화면 전환 및 세로 모드 대응 검증, 목표 기기에서 성능 검증, 사용 리소스의 라이선스 확인.

## 22. Video to Game 제작 가이드

콘셉트 이미지를 Image to Video의 시작 이미지로 사용한다. 9:16, 1920×1080, 5~10초, 카메라 움직임 최소화, 배경 및 캐릭터 일관성 유지, 장면 전환 없음. 모델 지원 설정에 맞춰 조정한다.

### English prompt

A playable 3D voxel pixel-art fantasy survival and castle defense game, shown from a fixed elevated third-person camera.

A beautiful medieval castle stands at the center of a pastel heavenly realm. Pink and sky-blue clouds, green grass tiles, colorful flowers, flowing rivers, waterfalls, and cherry blossom trees.

A small 32-pixel-style female mage wearing a blue and white outfit moves around the battlefield using a magical crystal staff. A cute white unicorn with a pastel rainbow mane follows beside her.

Blue and pink slime monsters spawn from different directions and move toward the player and the castle. The mage automatically fires glowing blue magical projectiles at nearby enemies while moving. Defeated slimes disappear into pixel particles and drop glowing experience crystals. The unicorn follows smoothly and periodically creates a soft healing effect.

The HUD remains fixed: HP and MP in the upper-left, wave counter and timer at the top center, currency and minimap in the upper-right, pet icon in the lower-left, experience bar at the bottom center, and three special magic skill buttons in the lower-right. A translucent virtual joystick is visible in the lower-left, with the pet icon positioned above it. No manual basic attack button.

Consistent character design, consistent castle architecture, stable terrain, smooth gameplay movement, readable combat effects, no cinematic cuts, no camera rotation, no scene transitions, 9:16 landscape gameplay footage.

### 10초 영상 구성

| 시간 | 장면 |
|---|---|
| 0~2초 | 성 앞 마법사와 유니콘 대기 |
| 2~4초 | 캐릭터 이동, 슬라임 접근 |
| 4~6초 | 자동 마법탄 발사 및 피격 |
| 6~8초 | 적 소멸, 경험치 결정 드롭 |
| 8~10초 | 특수 광역 마법 |

영상은 시각적 레퍼런스다. 정확한 게임 규칙, 충돌, AI, 저장, HUD 동작은 별도 개발 및 검증한다.

## 23. 출시 이후 업데이트 계획

정식 출시 범위에 포함된 수집, 도감, 업적, 일일 퀘스트, 무한 웨이브는 출시 이후로 미루지 않는다. 이후 업데이트 후보는 신규 월드·펫·캐릭터, 보스 레이드, 스킬 조합 진화, 코스튬, 날씨 및 시간대 변화, 온라인 랭킹, 계정 연동, 클라우드 저장이다. 멀티플레이는 별도 검토한다.

## 24. 디자인 원칙

- Beautiful World: 아름다운 파스텔 천국.
- Simple Control: 이동과 특수 스킬 중심의 간단한 조작.
- Powerful Growth: 후반 대량 처치와 폭발적인 성장.
- Lovely Companion: 애착을 형성하는 수집형 펫.
- Heaven Guardian: 생존뿐 아니라 지켜야 할 천국.

핵심 차별점은 힐링 감성의 외형과 긴장감 있는 전투의 결합이다. 그래픽, 자동 전투 및 성 방어, 펫 수집을 우선하고 나머지는 단계적으로 확장한다.

### 미확정 사항

피해 및 방어력 공식, 경험치 요구량 곡선, MP 자연 회복량, 특수 스킬 피해량, 보상량, 적 스폰 비율, 경로 탐색 방식, 중간 보스 세부 패턴, 신화 펫, 실제 성능 및 카메라 설정은 구현 전후 테스트로 확정한다. 추가로 30종 펫 및 20종 자동 스킬 등의 전체 목록, 해금 조건, 일일 퀘스트 규칙, 중복 펫 처리, 세이브 마이그레이션은 상세 설계에서 확정한다. 본 문서는 Markdown 텍스트 버전으로 참고 이미지와 인터랙티브 UI 예시는 포함하지 않는다.
