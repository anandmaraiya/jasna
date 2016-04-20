#!/usr/bin/R
args = commandArgs(trailingOnly=TRUE)
# test if there is at least one argument: if not, return an error
outputText = "output.txt"
outputPng  = "output.png"

if(length(args)==1){
fname = trimws(strsplit(args[1],".",fixed=TRUE)[[1]][1])
fname
lname = trimws(strsplit(args[1],".",fixed=TRUE)[[1]][2])
lname

outputText = paste(fname,'.txt',sep="")
outputText
outputPng = paste(fname,'.png',sep="")
outputPng
unlink(outputText)
myData <- function(file , filetype){
	switch(filetype,
		csv =  read.csv(file),
		xls = read.xls(file)
		)
	}
mydata= myData(args[1],lname)
}

sink(file = outputText, append= FALSE , type=c("output","message"),split=FALSE)
# Start of program
# use fname as common name specified and mydata as data specified
x = rnorm(50)
y = rnorm(50)
	
png(outputPng)
plot(x, y)
x

# end of program
sink()
q()