# SKALA Vue Hands-on

Vue 3와 Vite 기반으로 Vue의 반응형 상태 관리, Directive, 이벤트 처리, Form 바인딩, Computed, Watcher를 실습한 프로젝트입니다.

## 실행 방법

```bash
npm install
npm run dev
```

빌드 및 코드 검사:

```bash
npm run lint
npm run build
```

## 기술 스택

- Vue 3
- Composition API
- Vite
- JavaScript
- HTML/CSS
- ESLint
- Prettier

---

## 실습 내용

### 1. Vue Event Handling

#### v-on 이벤트 처리

파일: `EventHandler_v-on.vue`

- `v-on:click`의 축약형인 `@click` 사용
- 템플릿의 인라인 연산과 함수 호출 방식 비교
- `ref()`로 선언한 상태를 이벤트로 변경

#### Event Object

파일: `EventObject.vue`

- 브라우저가 생성하는 Event Object 확인
- `e.target`, 마우스 좌표 등 이벤트 정보 사용
- Vue의 `$event`를 사용하여 사용자 데이터와 이벤트 객체를 함께 전달

#### Event Modifier

파일: `EventModifier.vue`

- `.prevent`를 이용한 HTML 요소의 기본 동작 방지
- `.stop`을 이용한 이벤트 버블링 차단
- 부모 요소와 자식 요소에 각각 이벤트가 있을 때의 실행 차이 확인

---

### 2. Form Data Binding

#### HTML Form 요소와 v-model

파일: `FormDataBinding_Declaringv-modelVariables.vue`

- Textarea, Checkbox, Radio, Select와 `v-model` 연결
- 입력 요소의 종류에 맞는 `ref()` 초기값 선언
- 다중 Checkbox 선택값을 배열로 관리

#### v-model Modifier

파일: `FormDataBinding_Modifier.vue`

- `.lazy`: 입력 완료 후 상태 반영
- `.number`: 입력값을 숫자로 변환
- `.trim`: 입력값 앞뒤 공백 제거
- `.trim.number`: 여러 수식어 연결

---

### 3. Vue Style

파일: `VueStyle.vue`

- `<style scoped>`를 이용한 컴포넌트 스타일 격리
- 외부 CSS 파일 import
- Scoped CSS와 전역 CSS의 적용 범위 비교

---

### 4. Vue Reactivity

#### ref()

파일: `RefEx.vue`

- 문자열, 숫자, 불리언, 배열, 객체를 반응형 상태로 선언
- Script 영역에서는 `.value`를 이용하여 값 변경
- Template 영역에서는 `.value` 없이 자동 언래핑된 값 사용

#### reactive()

파일: `ReactiveEx.vue`

- 객체와 배열을 `reactive()`로 반응형 상태화
- 객체 속성 변경과 배열 요소 추가·삭제 확인
- `ref()`와 `reactive()`의 사용 방식 비교

#### computed()

파일: `ComputedEx.vue`

- 반응형 상태를 기반으로 파생 상태 계산
- 일반 함수와 Computed의 실행 방식 비교
- Computed의 의존성 추적과 결과 캐싱 확인

---

### 5. Vue Watcher

#### watch()

파일: `WatchEx.vue`

- 특정 반응형 상태의 변경 감시
- 콜백에서 이전 값과 새로운 값 확인

#### 다중 상태 Watch

파일: `WatchMultiSourceEx.vue`

- 배열을 이용하여 여러 반응형 상태를 동시에 감시
- 도시와 날짜 조건이 변경될 때 통합 로그 출력

#### 객체 내부 변경 감시

파일: `WatchDeepEx.vue`, `WatchReactive.vue`

- 객체 전체와 특정 속성 감시 방식 비교
- 객체의 참조 변경과 내부 속성 변경 차이 확인
- 중첩된 객체의 변경 감지를 위한 `deep: true` 사용
- 특정 속성을 Getter로 감시하는 방법 확인

#### watchEffect()

파일: `WatchEffectEx.vue`

- 콜백 내부에서 사용한 반응형 상태 자동 추적
- 컴포넌트 실행 직후 한 번 실행되는 특징 확인
- `watch()`의 명시적 감시와 `watchEffect()`의 자동 감시 비교

---

## Hands-on 1: Weather Mockup

파일: `WeatherMockup.vue`

### 배운 내용

- `ref()`를 이용한 날씨 배열과 검색어 상태 관리
- `v-for`를 이용한 날씨 카드 반복 렌더링
- `:key`에 도시 ID 바인딩
- `v-if / v-else`를 이용한 기온별 라벨 출력
- `:value`, `@input`을 조합한 입력값 처리
- `@click.stop`을 이용한 이벤트 버블링 차단
- `window.alert()`를 이용한 상세 정보 출력

### 구현 내용

- 날씨 데이터를 카드 형태로 반복 출력
- 카드 선택 시 상태바에 선택된 도시 표시
- 상세보기 클릭 시 날씨와 기온을 팝업으로 출력
- 25도 이상은 `🔥 더움`, 25도 미만은 `❄️ 선선함`으로 표시

### 교수님 예제와 다르게 구현한 점

- 기존 서울, 수원, 부산에 춘천과 판교 데이터 추가
- 날씨와 기온 버튼을 각각 만들지 않고 상세보기 버튼 하나로 통합
- 상세보기 팝업에서 날씨와 기온을 함께 출력
- 도시명, 상세보기 버튼, 온도 라벨을 한 행으로 구성

---

## Hands-on 2: Weather Composition

파일: `WeatherComposition.vue`

### 배운 내용

- `computed()`를 이용한 검색 결과 계산
- `watch()`를 이용한 선택 도시 상태 감시
- `watchEffect()`를 이용한 검색어 자동 추적
- 검색어에 따른 조건부 화면 렌더링

### 구현 내용

- 검색어가 없으면 전체 날씨 데이터 출력
- 검색어가 도시 이름에 포함되면 해당 도시만 출력
- 검색 결과가 없으면 안내 문구 출력
- 도시 선택 시 `watch()`로 상태 변경 로그 출력
- 검색어 입력 시 `watchEffect()`로 검색어 로그 출력

### 직접 추가한 기능

사용자가 더움의 기준 온도를 직접 변경할 수 있는 기능을 추가했습니다.

- `hotThreshold`: 사용자 지정 기준 온도를 저장하는 `ref`
- `hotCities`: 기준 온도 이상인 도시를 계산하는 `computed`
- `watch(hotThreshold)`: 기준 온도 변경 로그를 출력하는 Watcher
- `v-model.number`: 입력받은 기준 온도를 숫자로 변환

기준 온도를 변경하면 다음 항목이 함께 변경됩니다.

- 더운 도시 목록
- 각 카드의 `더움 / 선선함` 라벨
- 콘솔에 출력되는 기준 온도 변경 로그

### 교수님 예제와 다르게 구현한 점

- 도시 데이터를 3개에서 5개로 확장
- 날씨와 기온 상세 버튼을 하나로 통합
- 사용자 지정 더움 기준 온도 기능 추가
- 검색 결과를 기준으로 더운 도시 목록 계산
- 입력한 기준 온도에 따라 카드 라벨을 동적으로 변경

---

## 트러블슈팅

### 1. npm 명령 실행 시 package.json을 찾지 못한 문제

- 문제: `npm install`, `npm run dev` 실행 시 `ENOENT` 오류 발생
- 원인: `package.json`이 없는 상위 디렉터리에서 명령 실행
- 해결: Vue 프로젝트가 생성된 실제 디렉터리로 이동한 후 실행
- 배운 점: npm 명령은 `package.json`이 있는 프로젝트 루트에서 실행해야 함

### 2. 작성한 컴포넌트가 화면에 표시되지 않은 문제

- 문제: 컴포넌트 파일을 작성했지만 Vue 기본 화면만 출력
- 원인: 작성한 컴포넌트를 `App.vue`에서 import하고 렌더링하지 않음
- 해결: `App.vue`에 컴포넌트를 import하고 Template에 배치
- 배운 점: Vue 컴포넌트는 생성만으로 표시되지 않으며 상위 컴포넌트와 연결해야 함

### 3. Weather Mockup 디자인이 예시와 달랐던 문제

- 문제: 기능은 동작하지만 예시와 다른 기본 HTML 형태로 출력
- 원인: 예시에서 사용하는 CSS가 현재 프로젝트에 연결되지 않음
- 해결: 필요한 스타일을 추가하고 버튼의 `position` 충돌을 Scoped CSS로 조정
- 배운 점: 동일한 클래스 이름이 있어도 CSS 정의나 import가 없으면 디자인이 적용되지 않음

### 4. 상세보기 버튼 클릭 시 카드 이벤트도 실행된 문제

- 문제: 상세보기 버튼을 눌렀을 때 부모 카드의 선택 이벤트까지 실행
- 원인: 자식 버튼의 클릭 이벤트가 부모 요소로 버블링
- 해결: 버튼에 `@click.stop` 적용
- 배운 점: `.stop`은 JavaScript의 `event.stopPropagation()`에 대응하는 Vue 이벤트 수식어임

### 5. computed 검색 결과가 화면에 반영되지 않은 문제

- 문제: `filteredWeatherList`는 계산되지만 검색 결과와 관계없이 모든 도시 출력
- 원인: Template의 `v-for`가 `filteredWeatherList`가 아닌 원본 `weatherList`를 사용
- 해결: `v-for="item in filteredWeatherList"`로 수정
- 배운 점: Computed를 선언하는 것만으로 화면이 바뀌지 않으며 Template에서 계산 결과를 사용해야 함

### 6. WeatherComposition 컴파일 오류

- 문제: `<template>` 위치에서 Parsing Error 발생
- 원인: `<script setup>`의 닫는 `</script>` 태그 누락
- 해결: Script 영역을 닫은 후 Template 영역 작성
- 배운 점: Vue SFC의 `<script>`, `<template>`, `<style>` 영역을 정확히 구분해야 함

---

## 프로젝트 구조

```text
src/
├── components/
│   ├── code-challenge/
│   │   ├── EventHandler_v-on.vue
│   │   ├── EventObject.vue
│   │   ├── EventModifier.vue
│   │   ├── FormDataBinding_*.vue
│   │   ├── RefEx.vue
│   │   ├── ReactiveEx.vue
│   │   ├── ComputedEx.vue
│   │   └── Watch*.vue
│   └── hands-on/
│       ├── WeatherMockup.vue
│       └── WeatherComposition.vue
├── assets/
├── App.vue
└── main.js
```
