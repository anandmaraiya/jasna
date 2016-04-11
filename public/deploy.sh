#!/bin/bash

R_HOME="${OPENSHIFT_DATA_DIR}r"
R_VERSION="3.0.2"

mkdir -p $R_HOME

cd $R_HOME

if [ -e /sandbox/r ]; then
  unlink /sandbox/r
fi

ln -s `pwd` /sandbox/r

if [ ! -e "R-${R_VERSION}.tar.gz" ]; then
  wget http://cran.cnr.berkeley.edu/src/base/R-3/R-${R_VERSION}.tar.gz
fi

if [ -e "R-${R_VERSION}" ]; then
  rm -rf "R-${R_VERSION}"
fi

tar -xf R-${R_VERSION}.tar.gz

cd "R-${R_VERSION}"

./configure --prefix=/sandbox/r --with-recommended-packages=no
make
make install

rm -rf "R-${R_VERSION}"

cd ..