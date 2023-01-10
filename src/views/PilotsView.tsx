import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Box from "@mui/system/Box";
import { IChartrAccount, IPilotDetails, IPilotsViewProps } from "interfaces";
import { Add, Delete } from '@mui/icons-material';
import appConstants from '../constants/appConstants.json';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import React, { useEffect, useState, useRef, useMemo, memo, useCallback } from 'react';
import { ColumnApi, GridApi } from "ag-grid-community";
import { CircularProgress } from "@mui/material";
import PilotDetailView from "./PilotDetailView";
import AlertDialog from '../renderer/AlertDialog';
import AddPilotView from "./AddPilotView";
import ElrondService from 'services/elrondService';


export default function PilotsView(props: IPilotsViewProps): JSX.Element {
    const chartrAccount = props.account;
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openAddPilotDialog, setOpenAddPilotDialog] = useState<boolean>(false);
    const gridRef = useRef<AgGridReact<IPilotDetails>>(null);
    const [pilotData, setPilotData] = useState<IPilotDetails[]>([]);
    const containerStyle = useMemo(() => ({ width: 'auto', height: '100vh', padding: '8px', marginTop: '24px' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: 'auto' }), []);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentSelection, setCurrentSelection] = useState<IPilotDetails | null>();
    const [deleteHidden, setDeleteHidden] = useState<boolean>(true);
    const rowSelectionType = 'single';

    //let gridApi: GridApi
    //let columnApi: ColumnApi

    // const deleteCellRenderer = (params: any) => {
    //     return (
    //         <Button 
    //             style={{'fontSize': '12px', 'color': 'red'}}
    //             type="button" 
    //             onClick={() => {
    //                 alert("Are you sure you want to delete this pilot from the system?")
    //             }}
    //           >
    //               Delete
    //           </Button>
    //     );
    // };

    const [columnDefs, setColumnDefs] = useState([
        { field: 'id' },
        { field: 'firstName' },
        { field: 'lastName' },
        { field: 'email' },
    ]);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            suppressMovable: true,
            resizable: true,
            minWidth: 100,
        };
    }, []);

    const gridReady = useCallback((params: any) => {
        const gridApi: GridApi = params.api;
        const columnApi: ColumnApi = params.columnApi;

        gridApi.sizeColumnsToFit();

        setPilotData(props.account.businessProfile?.pilotDetails ?? []);

    }, []);

    const onRowSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current?.api.getSelectedRows();
        if (!selectedRows || selectedRows.length === 0) {
            setDeleteHidden(true);
            setCurrentSelection(null);
            return;
        }

        setCurrentSelection(selectedRows[0]);
        setDeleteHidden(false);

    }, []);

    const onDeleteClicked = () => {
        if (currentSelection) {
            setOpenDialog(true);
        }
    }

    const onAddClicked = () => {
        setOpenAddPilotDialog(true);
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
    }
    
    const handleCloseAddPilotDialog = () => {
        setOpenAddPilotDialog(false);
    }
    
    const handleConfirmDelete = async () => {
        const pilots = chartrAccount.businessProfile.pilotDetails;
        if (pilots && pilots.length > 0) {
            const pilotToDelete = pilots.find(p => {
                return p.id === currentSelection?.id;
            });

            if (pilotToDelete) {
                const idx = pilots.indexOf(pilotToDelete);
                pilots.splice(idx, 1);

                setLoading(true);
                const elrondService = new ElrondService(appConstants.API_BASE_URL_DEVNET);
                const egldAccount = await elrondService.getAccount(props.userSettings.walletAddress);
                if (egldAccount.balance.toNumber() === 0) {
                    setLoading(false);
                    alert("Verify you have enough EGLD to cover the small network fee (~$0.01 USD, cost varies) for saving your account data on the blockchain.")
                    return;
                }

                // Need to increment record version and update timestamp on each save
                chartrAccount.recordVersion += 1;
                chartrAccount.timestamp = new Date().toISOString();

                const result = await elrondService.saveAccount(
                    chartrAccount, 
                    egldAccount.nonce, 
                    props.userSettings,
                    props.password
                );

                if (result) {
                    alert('Pilot deleted successfully, check back in a few minutes while the transaction completes!');
                } else {
                    alert('Failed to delete pilot, please try again.');
                }
                setOpenDialog(false);
            }
        }
    }

    const handlePilotAdded = () => {
        alert('Pilot added successfully, check back in a few minutes while the transaction completes!');
        setOpenAddPilotDialog(false);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AlertDialog 
                open={openDialog}
                message='Are you sure you want to delete this pilot from the system?' 
                negativeButtonText='Cancel' 
                positiveButtonText='Delete'
                negativeFunc={handleCancelDelete}
                positiveFunc={handleConfirmDelete}
                title='Confirm'
            />

            <AddPilotView
                account={props.account}
                open={openAddPilotDialog}
                onClose={handleCloseAddPilotDialog} 
                pilotAdded={handlePilotAdded}
                userSettings={props.userSettings}
                password={props.password}
            />

            <div style={containerStyle}>
                <div style={{'padding': '8px'}}>
                    <span style={{'marginRight': '8px'}}>
                        <Button 
                            id='addPilotButton'
                            style={{'height': '34px', 'minWidth': '128px'}}
                            type='button' 
                            variant='contained' 
                            color='primary' 
                            className='buttonPrimary'
                            onClick={onAddClicked}
                        >
                            <Avatar sx={{'background' : 'transparent'}}>
                                <Add />
                            </Avatar>
                            Add
                        </Button>
                    </span>
                    <span hidden={deleteHidden}>
                        <Button 
                            id='deletePilotButton'
                            style={{'height': '34px', 'minWidth': '128px', 'background': 'red'}}
                            type='button' 
                            variant='contained' 
                            className='buttonPrimary'
                            onClick={onDeleteClicked}
                        >
                            <Avatar sx={{'background' : 'transparent'}}>
                                <Delete />
                            </Avatar>
                            Delete
                        </Button>
                    </span>
                </div>
                <div className='ag-theme-alpine' style={gridStyle}>
                    <AgGridReact<IPilotDetails> 
                        ref={gridRef}
                        rowData={pilotData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        onGridReady={gridReady}
                        rowSelection={rowSelectionType}
                        onSelectionChanged={onRowSelectionChanged}
                    />
                </div>
            </div>
        </Box>
    );
}