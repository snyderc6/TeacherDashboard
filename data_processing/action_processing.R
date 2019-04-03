data <- read.csv(file="chicago_actions.csv", header=TRUE, sep=",")
data <- data[1:36,1:2]
actions <- data[,2]
actions <- as.character(actions)
students <- data[,1]

maxAction = 0
for(i in 1:36){
  a <- strsplit(actions[i],";")
  f = vector()
  for(j in 1:length(a[[1]])){
    f <- append(f, a[[1]][j])
  }
  actionsTotal = length(f)
  if(actionsTotal > maxAction){
    maxAction = actionsTotal
  }
}


allActions = c("student")
for(i in 1:maxAction){
  allActions <- append(allActions, i)
}


for(i in 1:36){
  a <- strsplit(actions[i],";")
  f = vector()
  numActions = length(a[[1]])
  f <- append(f,factor(students[i]))
  for(j in 1:numActions){
    f <- append(f, a[[1]][j])
  }
  for(j in (numActions+1):maxAction){
    f <- append(f, "None")
  }
  allActions = rbind(allActions, f)
  
}

write.csv(allActions, file = "Chicago_MB1_Actions_Sep.csv" ,row.names=FALSE)