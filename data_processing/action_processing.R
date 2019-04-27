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

write.csv(t(allActions), file = "Chicago_MB1_Actions_Sep.csv" ,row.names=FALSE)




data <- read.csv(file="Chicago_MB1_Actions_Sep.csv", header=FALSE, sep=",")
actions = c("student", "actionNum", "actionType")
for(i in 2:ncol(data)){
  for(j in 2:nrow(data)){
    actionType = levels(droplevels(data[j,i]))
    if(actionType != "None"){
      newRow = c(levels(droplevels(data[1,i])), j-1, actionType)
      actions = rbind(actions, newRow)
    }
  }
}


write.csv(actions, file = "Chicago_MB1_Actions_Format1.csv" ,row.names=FALSE)
