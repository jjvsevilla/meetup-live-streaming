import { ROW_COUNT_CHANGED, ROW_DATA, DATA_UPDATED } from "./viewportService";

const UPDATE_DATA_INTERVAL = 50;
const SEND_EVENT_TO_VIEWPORT_INTERVAL = 20;

export function createMockServer() {
  function MockServer() {
    this.connections = {};
    this.nextConnectionId = 0;
    setInterval(this.periodicallyUpdateData.bind(this), UPDATE_DATA_INTERVAL);
  }

  MockServer.prototype.periodicallyUpdateData = function() {
    const changes = [];
    this.makeSomePriceChanges(changes);
    this.makeSomeVolumeChanges(changes);
    this.informConnectionsOfChanges(changes);
  };

  MockServer.prototype.informConnectionsOfChanges = function(changes) {
    const that = this;
    Object.keys(this.connections).forEach(function(connectionId) {
      const connection = that.connections[connectionId];
      const changesThisConnection = [];
      changes.forEach(function(change) {
        const changeInRange =
          change.rowIndex >= connection.firstRow &&
          change.rowIndex <= connection.lastRow;
        if (changeInRange) {
          changesThisConnection.push(change);
        }
      });
      if (changesThisConnection.length > 0) {
        that.sendEventAsync(connectionId, {
          eventType: DATA_UPDATED,
          changes: changesThisConnection
        });
      }
    });
  };

  MockServer.prototype.makeSomeVolumeChanges = function(changes) {
    for (let i = 0; i < 10; i++) {
      const index = Math.floor(this.allData.length * Math.random());
      const dataItem = this.allData[index];
      const move = Math.floor(10 * Math.random()) - 5;
      const newValue = dataItem.volume + move;
      dataItem.volume = newValue;
      changes.push({
        rowIndex: index,
        columnId: "volume",
        newValue: dataItem.volume
      });
    }
  };

  MockServer.prototype.makeSomePriceChanges = function(changes) {
    for (let i = 0; i < 10; i++) {
      const index = Math.floor(this.allData.length * Math.random());
      const dataItem = this.allData[index];
      const move = Math.floor(30 * Math.random()) / 10 - 1;
      const newValue = dataItem.mid + move;
      dataItem.mid = newValue;
      this.setBidAndAsk(dataItem);
      changes.push({
        rowIndex: index,
        columnId: "mid",
        newValue: dataItem.mid
      });
      changes.push({
        rowIndex: index,
        columnId: "bid",
        newValue: dataItem.bid
      });
      changes.push({
        rowIndex: index,
        columnId: "ask",
        newValue: dataItem.ask
      });
    }
  };

  MockServer.prototype.init = function(allData) {
    this.allData = allData;
    var that = this;
    this.allData.forEach(function(dataItem) {
      dataItem.volume = Math.floor(Math.random() * 10000 + 100);
      dataItem.mid = Math.random() * 300 + 20;
      that.setBidAndAsk(dataItem);
    });
  };

  MockServer.prototype.setBidAndAsk = function(dataItem) {
    dataItem.bid = dataItem.mid * 0.98;
    dataItem.ask = dataItem.mid * 1.02;
  };

  MockServer.prototype.connect = function(listener) {
    const connectionId = this.nextConnectionId;
    this.nextConnectionId++;
    this.connections[connectionId] = {
      listener: listener,
      rowsInClient: {},
      firstRow: 0,
      lastRow: -1
    };
    this.sendEventAsync(connectionId, {
      eventType: ROW_COUNT_CHANGED,
      rowCount: this.allData.length
    });
    return connectionId;
  };

  MockServer.prototype.sendEventAsync = function(connectionId, event) {
    const listener = this.connections[connectionId].listener;
    setTimeout(() => listener(event), SEND_EVENT_TO_VIEWPORT_INTERVAL);
  };

  MockServer.prototype.disconnect = function(connectionId) {
    delete this.connections[connectionId];
  };

  MockServer.prototype.setViewportRange = function(
    connectionId,
    firstRow,
    lastRow
  ) {
    const connection = this.connections[connectionId];
    connection.firstRow = firstRow;
    connection.lastRow = lastRow;
    this.purgeFromClientRows(connection.rowsInClient, firstRow, lastRow);
    this.sendResultsToClient(connectionId, firstRow, lastRow);
  };

  MockServer.prototype.purgeFromClientRows = function(
    rowsInClient,
    firstRow,
    lastRow
  ) {
    Object.keys(rowsInClient).forEach(function(rowIndexStr) {
      const rowIndex = parseInt(rowIndexStr);
      if (rowIndex < firstRow || rowIndex > lastRow) {
        delete rowsInClient[rowIndex];
      }
    });
  };

  MockServer.prototype.sendResultsToClient = function(
    connectionId,
    firstRow,
    lastRow
  ) {
    if (firstRow < 0 || lastRow < firstRow) {
      console.warn("start or end is not valid");
      return;
    }
    const rowsInClient = this.connections[connectionId].rowsInClient;
    const rowDataMap = {};
    for (let i = firstRow; i <= lastRow; i++) {
      if (rowsInClient[i]) {
        continue;
      }
      rowDataMap[i] = this.allData[i];
      rowsInClient[i] = true;
    }
    this.sendEventAsync(connectionId, {
      eventType: ROW_DATA,
      rowDataMap: rowDataMap
    });
  };
  MockServer.prototype.getRowCount = function() {
    return this.allData.length;
  };
  return new MockServer();
}
