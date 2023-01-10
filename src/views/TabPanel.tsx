import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { ITabPanelProps } from "interfaces";


export default function TabPanel(props: ITabPanelProps): JSX.Element {
    const { children, selectedTab, tabIndex, ...other } = props;

    return (
        <div
          role="tabpanel"
          hidden={selectedTab !== tabIndex}
          id={`tabpanel-${tabIndex}`}
          aria-labelledby={`tab-${tabIndex}`}
          {...other}
        >
          {selectedTab === tabIndex && (
            <Box sx={{ p: 3 }}>
              <Typography>{children}</Typography>
            </Box>
          )}
        </div>
      );
}