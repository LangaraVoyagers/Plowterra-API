const harvestLogMessage = {
  HARVEST_LOG_CREATE_SUCCESS: "Harvest log created successfully",
  HARVEST_LOG_CREATE_ERROR: "Harvest log not created try again later",
  HARVEST_LOG_UPDATE_SUCCESS: "Harvest log updated successfully",
  HARVEST_LOG_UPDATE_ERROR: "Harvest log not updated, try again later",
  HARVEST_LOG_UDATE_PASSED_DATE:
    "Yikes! You cannot update this harvest log after a day has passed. Please submit a correction log",
  HARVEST_LOG_DELETE_SUCCESS: "Harvest log deleted successfully",
  HARVEST_LOG_DELETE_ERROR: "Harvest log not deleted, try again later",
  HARVEST_LOG_DELETE_PASSED_DATE:
    "Yikes! You cannot delete this harvest log after a day has passed. Please submit a correction log",
  INVALID_SEASON_ID: "Please, provide a valid season Id",
  INVALID_PICKER_ID: "Please, provide a valid picker Id",
  INVALID_SEASON_DEDUCTION_ID: "Please, provide valid season deduction Ids",
  COLLECTED_AMOUNT_NUMBER_ERROR: "Collected amount needs to be a valid number",
  COLLECTED_AMOUNT_GREATER_THAN_ZERO:
    "Collected amount needs to be greater than zero",
  ERROR: "Some error occurred, try again later",
  SUCCESS: "Found record",
  NOT_FOUND: "No record was found",
};

export default harvestLogMessage;
