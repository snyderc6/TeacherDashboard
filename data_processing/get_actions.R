##############################################################################################################
#for one file
doc <- read_xml("bzs01ChicagoMB1.xml")
allEvents = xml_find_all(doc, ".//replay/event") 
data = bind_rows(lapply(xml_attrs(allEvents), function(x) data.frame(as.list(x), stringsAsFactors=FALSE)))
write.csv(data, file = "bzs01_Actions.csv",row.names=TRUE)
#############################################################################################################


#############################################################################################################
#for all files in folder
#get actions from xml to csv

dir <- ("C:/Users/Caitlin/Desktop/Data/Chicago MB2")
files<-list.files(path=dir, pattern='.xml', full.names = FALSE)
allActions = matrix(, nrow = length(files), ncol = 2)
index = 1
for(file in files){
  doc <- read_xml(file)
  allEvents = xml_find_all(doc, ".//replay/event") 
  data = bind_rows(lapply(xml_attrs(allEvents), function(x) data.frame(as.list(x), stringsAsFactors=FALSE)))
  name = str_remove_all(file, "[.xml]")
  new_name = paste0(name, ".csv")
  write.csv(data, file = new_name ,row.names=TRUE)
  
  studentUserName =  str_sub(file, end=-15)
  print(studentUserName)
  actions = c()
  for(i in 1: nrow(data)){
    if(data$username[i] == studentUserName){
      actions = list.append(actions, data$type[i])
    }
  }
  allActions[index,1] = studentUserName
  allActions[index,2] = paste(actions, collapse = ";")
  index = index + 1
}
write.csv(allActions, file = "ChicagoMB2Actions.csv" ,row.names=FALSE)
#############################################################################################################


#############################################################################################################

#############################################################################################################

