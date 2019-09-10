import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { createMockServer } from "../../services/wsService";
import { createViewportDatasource } from "../../services/viewportService";
import { numberFormatter } from "../../helpers/formatters";
import "./Grid.scss";

const apiUrl =
  "https://rawgit.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/stocks.json";

const FIT_COLUMNS_INTERVAL = 100;

class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "#",
          width: 50,
          cellRenderer: "rowIdRenderer"
        },
        {
          headerName: "Code",
          field: "code",
          width: 70
        },
        {
          headerName: "Name",
          field: "name",
          width: 300
        },
        {
          headerName: "Bid",
          field: "bid",
          width: 100,
          cellClass: "cell-number",
          valueFormatter: numberFormatter,
          cellRenderer: "agAnimateShowChangeCellRenderer"
        },
        {
          headerName: "Mid",
          field: "mid",
          width: 100,
          cellClass: "cell-number",
          valueFormatter: numberFormatter,
          cellRenderer: "agAnimateShowChangeCellRenderer"
        },
        {
          headerName: "Ask",
          field: "ask",
          width: 100,
          cellClass: "cell-number",
          valueFormatter: numberFormatter,
          cellRenderer: "agAnimateShowChangeCellRenderer"
        },
        {
          headerName: "Volume",
          field: "volume",
          width: 80,
          cellClass: "cell-number",
          cellRenderer: "agAnimateSlideCellRenderer"
        }
      ],
      defaultColDef: { resizable: true },
      rowSelection: "multiple",
      rowModelType: "viewport",
      getRowNodeId: function(data) {
        return data.code;
      },
      components: {
        rowIdRenderer: function(params) {
          return "" + params.rowIndex;
        }
      }
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    fetch(apiUrl)
      .then(rawResponse => rawResponse.json())
      .then(data => {
        const mockServer = createMockServer();
        mockServer.init(data);

        const viewportDatasource = createViewportDatasource(mockServer);
        params.api.setViewportDatasource(viewportDatasource);

        setTimeout(() => params.api.sizeColumnsToFit(), FIT_COLUMNS_INTERVAL);
      });
  };

  render() {
    return (
      <div id="myGrid" className="grid ag-theme-balham">
        <AgGridReact
          columnDefs={this.state.columnDefs}
          defaultColDef={this.state.defaultColDef}
          debug={true}
          rowSelection={this.state.rowSelection}
          rowModelType={this.state.rowModelType}
          getRowNodeId={this.state.getRowNodeId}
          components={this.state.components}
          onGridReady={this.onGridReady}
        />
      </div>
    );
  }
}

export default Grid;
