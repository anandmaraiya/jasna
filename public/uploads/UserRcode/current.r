

data <- read.csv("default.csv", header = TRUE)
library(ggplot2)
filename = paste('current.png')
png(filename)
ggplot(data, aes(Age, Height, colour = factor(Class))) + geom_point() +
  geom_path() 
  dev.off()