export const ROW_COUNT_CHANGED = "rowCountChanged";
export const ROW_DATA = "rowData";
export const DATA_UPDATED = "dataUpdated";

export function createViewportDatasource(mockServer) {
  function ViewportDatasource(mockServer) {
    this.mockServer = mockServer;
    this.connectionId = this.mockServer.connect(this.eventListener.bind(this));
  }
  ViewportDatasource.prototype.setViewportRange = function(firstRow, lastRow) {
    console.log("setViewportRange: " + firstRow + " to " + lastRow);
    this.mockServer.setViewportRange(this.connectionId, firstRow, lastRow);
  };
  ViewportDatasource.prototype.init = function(params) {
    this.params = params;
  };
  ViewportDatasource.prototype.destroy = function() {
    this.mockServer.disconnect(this.connectionId);
  };
  ViewportDatasource.prototype.eventListener = function(event) {
    switch (event.eventType) {
      case ROW_COUNT_CHANGED:
        this.onRowCountChanged(event);
        break;
      case ROW_DATA:
        this.onRowData(event);
        break;
      case DATA_UPDATED:
        this.onDataUpdated(event);
        break;
      default:
        break;
    }
  };
  ViewportDatasource.prototype.onRowData = function(event) {
    const rowDataFromServer = event.rowDataMap;
    this.params.setRowData(rowDataFromServer);
  };
  ViewportDatasource.prototype.onDataUpdated = function(event) {
    const that = this;
    event.changes.forEach(function(change) {
      const rowNode = that.params.getRow(change.rowIndex);
      if (!rowNode || !rowNode.data) {
        return;
      }
      rowNode.setDataValue(change.columnId, change.newValue);
    });
  };
  ViewportDatasource.prototype.onRowCountChanged = function(event) {
    const rowCountFromServer = event.rowCount;
    this.params.setRowCount(rowCountFromServer);
  };
  return new ViewportDatasource(mockServer);
}
