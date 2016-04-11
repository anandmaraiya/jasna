

data <- read.csv("C:/nodi2/public/uploads/UserData/default.csv", header = TRUE)
library(ggplot2)
filename = paste('C:/nodi2/public/current.png')
png(filename)
ggplot(data, aes(Age, Height, colour = factor(Class))) + geom_point() +
  geom_path() 
  dev.off()