# 1. 공식 Nginx 이미지를 사용
FROM nginx:alpine

# 2. Nginx에 필요한 설정 파일 복사(필요하다면 추가)
#   만약 커스텀 nginx.conf가 있다면 /etc/nginx/nginx.conf 로 복사.
#   여기서는 기본 설정을 사용한다고 가정하므로 생략하겠습니다.

# 3. 컨테이너 내 HTML 제공 폴더로 프로젝트 복사
#   복사 대상: 현재 디렉터리(.) → Nginx가 서빙하는 폴더(/usr/share/nginx/html)
COPY . /usr/share/nginx/html

# 4. 80번 포트 노출
EXPOSE 80

# 5. 컨테이너 실행 시 Nginx가 동작하도록 설정
CMD ["nginx", "-g", "daemon off;"]
