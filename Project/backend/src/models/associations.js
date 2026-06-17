const User = require("./User");
const UserType = require("./UserType");
const Company = require("./company");
const Request = require("./requestModel");
const RequestType = require("./requestTypeModel");
const RequestFile = require("./requestFilesModel");
const Question = require("./questions");
const MessageQuestion = require("./messagesQuestions");
const EstadoPedido = require("./requestStatus");
const Logs = require("./logs");
const Incident = require("./incidentModel");


function applyAssociations() {

  // UserType <-> User
  UserType.hasMany(User, { foreignKey: "id_tipo" });
  User.belongsTo(UserType, { foreignKey: "id_tipo" });

  //------------------------------//

  // Company <-> User
  Company.hasMany(User, { foreignKey: "id_empresa", as: "users" });
  User.belongsTo(Company, { foreignKey: "id_empresa", as: "company" });

  //------------------------------//

  // RequestType <-> Request
  RequestType.hasMany(Request, { foreignKey: "requestTypeId" });
  Request.belongsTo(RequestType, { foreignKey: "requestTypeId" });

  //------------------------------//

  // User (creator) <-> Request
  User.hasMany(Request, { foreignKey: "creatorId", sourceKey: "id_Utilizador", as: "createdRequests" });
  Request.belongsTo(User, { foreignKey: "creatorId", targetKey: "id_Utilizador", as: "creator" });

  //------------------------------//

  // User (assignedTo) <-> Request
  User.hasMany(Request, { foreignKey: "assignedToId", sourceKey: "id_Utilizador", as: "assignedRequests" });
  Request.belongsTo(User, { foreignKey: "assignedToId", targetKey: "id_Utilizador", as: "assignedTo" });

  //------------------------------//

  // Request <-> RequestFile
  Request.hasMany(RequestFile, { foreignKey: "requestId", as: "files" });
  RequestFile.belongsTo(Request, { foreignKey: "requestId" });

  //------------------------------//

  // User (creator) <-> Question
  User.hasMany(Question, { foreignKey: "creatorId", sourceKey: "id_Utilizador", as: "createdQuestions" });
  Question.belongsTo(User, { foreignKey: "creatorId", targetKey: "id_Utilizador", as: "creator" });

  //------------------------------//

  // User (assignedTo) <-> Question
  User.hasMany(Question, { foreignKey: "assignedToId", sourceKey: "id_Utilizador", as: "assignedQuestions" });
  Question.belongsTo(User, { foreignKey: "assignedToId", targetKey: "id_Utilizador", as: "assignedTo" });

  //------------------------------//

  // Question <-> MessageQuestion
  Question.hasMany(MessageQuestion, { foreignKey: "questionId", as: "messages" });
  MessageQuestion.belongsTo(Question, { foreignKey: "questionId" });

  //------------------------------//

  // User <-> MessageQuestion
  User.hasMany(MessageQuestion, { foreignKey: "userId", sourceKey: "id_Utilizador", as: "sentMessages" });
  MessageQuestion.belongsTo(User, { foreignKey: "userId", targetKey: "id_Utilizador", as: "sender" });

  //------------------------------//

  // Request <-> EstadoPedido
  Request.hasMany(EstadoPedido, { foreignKey: "requestId", as: "states" });
  EstadoPedido.belongsTo(Request, { foreignKey: "requestId" });

  //------------------------------//

  // User <-> EstadoPedido
  User.hasMany(EstadoPedido, { foreignKey: "userId", sourceKey: "id_Utilizador", as: "requestStates" });
  EstadoPedido.belongsTo(User, { foreignKey: "userId", targetKey: "id_Utilizador", as: "changedBy" });

  //------------------------------//

  // User <-> Logs
  User.hasMany(Logs, { foreignKey: "userId", sourceKey: "id_Utilizador", as: "logs" });
  Logs.belongsTo(User, { foreignKey: "userId", targetKey: "id_Utilizador", as: "user" });

  //------------------------------//

  // User <-> Incident
  User.hasMany(Incident, { foreignKey: "creatorId", sourceKey: "id_Utilizador", as: "incidents" });
  Incident.belongsTo(User, { foreignKey: "creatorId", targetKey: "id_Utilizador", as: "creator" });

}

module.exports = applyAssociations;