#!/usr/bin/R
args = commandArgs(trailingOnly=TRUE)
# test if there is at least one argument: if not, return an error
outputText = "output.txt"
outputPng  = "output.png"
if(length(args)> 0){
fname = trimws(strsplit(args[1],".",fixed=TRUE)[[1]][1])
fname
lname = trimws(strsplit(args[1],".",fixed=TRUE)[[1]][2])
lname

outputText = paste(fname,'.txt',sep="")
outputText
outputPng = paste(fname,'.png',sep="")
outputPng
#unlink(outputText)
myData <- function(file , filetype){
	switch(filetype,
		csv =  read.csv(file),
		xls = read.xls(file)
		)
	}
mydata <- myData(args[1],lname)
} 
sink(file = outputText, append= FALSE , type=c("output","message"),split=FALSE)
# Start of program
# use fname as common name specified and mydata as data specified

ss<-100 #sample size
v<-1 # v is the variance=
data<-rnorm(ss,0,v) 
c=1
data1<-data
ss1<-ss
k<-2# the level of outlier detection, greater the k, lesser the outliers detected
out<-array(dim=1)
while(c >0){

mu<-mean(data1)
std<-sd(data1)
for(i in 1:ss1){
  if((data1[i]>(mu+k*std))||(data1[i]<(mu-k*std))){
    for(j in 1:ss){
      if(data[j]==data1[i]){m=j}
    }
    out<-c(out,m)
  }
}
data1<-data[data<(mu+k*std)]
data1<-data[data>(mu-k*std)]
c<-ss1-length(data1)
ss1<-length(data1)

}

print(out)
#except for the first element NA, all others are outliers
 # end of program
sink()
q()





#except for the first element NA, all others are outliers
  