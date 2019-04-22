data <- read.csv(file="chicago_actions.csv", header=TRUE, sep=",")
data <- data[1:36,1:2]
actions <- data[,2]
actions <- as.character(actions)



# features <- total actions, plays, change, model, steps, create, proportions of each
features = c("student", "total_actions", "total_plays", "total_changes", "total_models", 
             "total_steps", "total_creates", "prop_plays", "prop_changes", "prop_models",
             "prop_steps", "prop_creates")

for(i in 1:36){
  a <- strsplit(actions[i],";")
  f = vector()
  for(j in 1:length(a[[1]])){
    f <- append(f, a[[1]][j])
  }
  actionsTotal = length(f)
  playsTotal = 0
  modelsTotal = 0
  stepsTotal = 0
  createsTotal = 0
  changesTotal = 0
  
  print(actionsTotal)
  print(i)
  for(k in 1:actionsTotal){
    if(f[k] == "MODEL"){
      modelsTotal = modelsTotal + 1
    }else if(f[k] == "PLAY"){
      playsTotal = playsTotal + 1
    }else if(f[k] == "CHANGE"){
      changesTotal = changesTotal + 1
    }else if(f[k] == "STEP"){
      stepsTotal = stepsTotal + 1
    }else if(f[k] == "CREATE"){
      createsTotal = createsTotal + 1
    }
  }
  newRow = c(data[i,1],actionsTotal, playsTotal, changesTotal, modelsTotal, stepsTotal, createsTotal,
             playsTotal/actionsTotal, changesTotal/actionsTotal, modelsTotal/actionsTotal, stepsTotal/actionsTotal,
             createsTotal/actionsTotal)
  features = rbind(features, newRow)
}


data <- read.csv(file="chicago_actions.csv", header=TRUE, sep=",")
data <- data[1:36,1:2]
actions <- data[,2]
actions <- as.character(actions)

for(i in 1:36){
  a <- strsplit(actions[i],";")
  
}
