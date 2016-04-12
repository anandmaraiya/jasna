
x = rnorm(50)

y = rnorm(50)


filename = paste('current.png')

png(filename)

plot(x, y)

cat("Hello")

dev.off()