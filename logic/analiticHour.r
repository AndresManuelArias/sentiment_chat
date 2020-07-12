base_datos <- read.csv("../base_data/dataTableAnaliticEmotionText.csv")
base_datos[1,]

# fecha <- '2018-06-27T19:40:00.000Z'

# formatoFecha = function(fecha){
#     substr(fecha,12,13)
# }

# cleanBase_datos = replace(base_datos$fecha,,substr(base_datos$fecha,12,13))

# cleanBase_datos[1:2,]
# cleanBase_datos = base_datos[base_datos$fecha <- substr(base_datos$fecha,12,13),]
#  eliminar nulos 
base_datos <- base_datos[!is.na(base_datos$puntajeEmocion),]
#unir valores por hora
emotionHourMean = aggregate(base_datos$puntajeEmocion, by=list(fecha=base_datos$fecha), FUN=mean)

titulo = 'grafica_emotion_hour'
png(file = paste("../public/",titulo, ".png"))    
plot(puntajeEmocion ~ fecha,data =base_datos)
abline(lm(base_datos$fecha ~ base_datos$puntajeEmocion ))
correlacion <- cor(base_datos$puntajeEmocion,base_datos$fecha)        
legend("bottomleft",col=c(correlacion),legend =c(correlacion), lwd=3, bty = "n")

dev.off()

titulo = 'grafica_emotion_hour_mean'
png(file = paste("../public/",titulo, ".png"))    
plot(emotionHourMean )
dev.off()

titulo = 'bandera_emotion_hour'
png(file = paste("../public/",titulo, ".png"))    
boxplot(puntajeEmocion ~ fecha,data =base_datos)
dev.off()

titulo = 'histograma_emotion_hour_mean'
png(file = paste("../public/",titulo, ".png"))    
hist(emotionHourMean$x )
dev.off()