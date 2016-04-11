

data <- read.csv("C:/nodi2/public/uploads/UserData/default.csv", header = TRUE)

library(ggplot2)
filename = paste('C:/nodi2/public/current.png')
png(filename)
ggplot(data, aes(time, BJsales )) +
  geom_path() 
  dev.off() 