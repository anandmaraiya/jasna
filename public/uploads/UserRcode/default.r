

data <- read.csv("default.csv", header = TRUE)

library(ggplot2)
filename = paste('current.png')
png(filename)
ggplot(data, aes(time, BJsales )) +
  geom_path() 
  dev.off() 