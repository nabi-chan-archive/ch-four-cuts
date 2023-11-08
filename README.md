# ch-four-cuts

채널네컷

## Projects

| 프로젝트명                                        | 프로젝트 설명         |
| ------------------------------------------------- | --------------------- |
| [**ch-four-cuts**](./apps/ch-four-cuts/README.md) | 채널네컷 어플리케이션 |

## Packages

| 패키지 이름                                                                         | 패키지 설명                 |
| ----------------------------------------------------------------------------------- | --------------------------- |
| [**@ch-four-cuts/configs**](./packages/configs/README.md)                           | eslint, prettier 설정 모음  |
| [**@ch-four-cuts/tsconfig**](./packages/tsconfig/README.md)                         | 전역 tsconfig 설정          |
| [**@ch-four-cuts/bezier-design-system**](./packages/bezier-design-system/README.md) | 디자인 시스템 관련 코드뭉치 |
| [**@ch-four-cuts/sony-camera**](./packages/sony-camera/README.md)                   | 소니 카메라 관련 라이브러리 |

## Commit convention

- feat: 새로운 기능
- fix: 버그 / 이슈 수정
- docs: 문서만 변경하는 경우
- style: 코드의 로직을 변경하지 않는 코드의 수정사항 (공백, 포맷팅, 세미콜론 추가, 등등)
- refactor: 버그 또는 기능 추가가 아닌 코드의 수정사항
- perf: 코드의 성능을 개선하는 수정사항
- test: 새롭게 테스트를 추가하거나 변경
- chore: 패키지 매니저 수정, 설정 파일 수정과 같이 설정과 관련된 수정사항

## System Requirements

- nodeJS 18.x | 20.x
- Python 2.x (depends on [`printer`](https://www.npmjs.com/package/printer) package @ ch-four-cuts)
- turbo 1.10
