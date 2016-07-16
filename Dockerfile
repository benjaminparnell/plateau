FROM ubuntu:14.04
MAINTAINER Ben Parnell <benjaminparnell.94@gmail.com>

RUN apt-get -y update --fix-missing
RUN apt-get -y install curl
RUN apt-get -y upgrade
RUN apt-get -y clean

RUN sh -c "curl -fsSL https://raw.githubusercontent.com/isaacs/nave/master/nave.sh > /usr/local/bin/nave && chmod a+x /usr/local/bin/nave"

RUN nave usemain 6

RUN mkdir -p /var/application/plateau
RUN mkdir -p /var/data/plateau

WORKDIR /var/application/plateau
ADD . /var/application/plateau

EXPOSE 9001
