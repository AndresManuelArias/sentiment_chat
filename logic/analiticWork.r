base_datos <- read.csv("../base_data/resultAnaliticDataCsv.csv")
dataCleanScoreEmotionDay = base_datos[!is.na(base_datos$scoreEmotionDay),] 
dates = unique(dataCleanScoreEmotionDay$fechas)
for (date in dates){
    titulo = date
    resulDay = dataCleanScoreEmotionDay[dataCleanScoreEmotionDay$fechas ==  date,]
    png(file = paste("../public/",titulo, ".png"))    
    plot(resulDay$scoreWorkDay,resulDay$scoreEmotionDay)
    dev.off()
}

titulo = 'todo'
png(file = paste("../public/",titulo, ".png"))    
plot(dataCleanScoreEmotionDay$scoreEmotionDay,dataCleanScoreEmotionDay$scoreWorkDay)
abline(lm(dataCleanScoreEmotionDay$scoreWorkDay ~ dataCleanScoreEmotionDay$scoreEmotionDay))
correlacion <- cor(dataCleanScoreEmotionDay$scoreEmotionDay,dataCleanScoreEmotionDay$scoreWorkDay)        
legend("bottomleft",col=c(correlacion),legend =c(correlacion), lwd=3, bty = "n")
dev.off()

some<-function(datos) {
    todos = c(FALSE);
    for(d in datos){
        if(d != 0){
            todos[1]= TRUE 
        }
    }
    todos[1]
} 
peoples = unique(dataCleanScoreEmotionDay$name)
for (people in peoples){
    titulo = people
    resulPeople = dataCleanScoreEmotionDay[dataCleanScoreEmotionDay$name ==  people,]
    png(file = paste("../public/",titulo, ".png"))    
    print('andando')
    plot(resulPeople$scoreEmotionDay,resulPeople$scoreWorkDay ,main=paste(titulo))
    if( some(resulPeople$scoreWorkDay ) && some(resulPeople$scoreEmotionDay) ){
        abline(lm(resulPeople$scoreWorkDay ~ resulPeople$scoreEmotionDay))
        correlacion <- cor(resulPeople$scoreEmotionDay,resulPeople$scoreWorkDay)        
        legend("bottomleft",col=c(correlacion),legend =c(correlacion), lwd=3, bty = "n")
        print(people)
        print(correlacion)
    }
    dev.off()
}
titulo = 'velas_workDay'
png(file = paste("../public/",titulo, ".png"))    
boxplot(dataCleanScoreEmotionDay$scoreWorkDay)
dev.off()
titulo = 'velas_scoreEmotionDay'
png(file = paste("../public/",titulo, ".png"))    
boxplot(dataCleanScoreEmotionDay$scoreEmotionDay)
dev.off()

