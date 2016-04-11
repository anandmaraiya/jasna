
x = rnorm(50)

y = rnorm(50)


filename = paste('C:/nodi2/public/current.png')

png(filename)

plot(x, y)

dev.off()