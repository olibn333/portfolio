import React, { useState } from 'react'
import { AppBar, Box, makeStyles, Typography, createMuiTheme, ThemeProvider, Tabs, Tab, Paper } from '@material-ui/core'
import * as mySVGJSON from './svg.json'
// import {createNode} from './nodegarden'

const theme = createMuiTheme({
    typography: {
      fontFamily: [
        'Garamond',
      ].join(','),
    },
    palette : {
        type:'dark',
        primary: {
            main: 'rgb(255,255,255)'
        },
        secondary: {
            main:'rgb(0,0,0)'
        }
    }
  });

const useStyles = makeStyles(theme=>({

    mySVG: {
        height:'100%',
        width:'100%',
        fill:'white',
    },
    mySVGPath:{
        transition:'2s',
        transform: 'translate(27%,43%)'
    }
}))


const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <TabBar></TabBar>
        <Box display="flex" justifyContent="center" className="center">
            <Typography variant="h1">Oliver Belfitt-Nash</Typography>
            {/* <NameSVG /> */}
        </Box>
        </ThemeProvider>
    )
}

const TabBar = () => {
    const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
      <Paper className={classes.opac1}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Node Garden" />
        <Tab label="Pavlov Horde" />
        <Tab label="MVR Power" />
      </Tabs>
      </Paper>
  )
}

const NameSVG = () => {
    const classes = useStyles()

    const [myPath, setPath] = useState(mySVGJSON.path)
    const [clicked, setClicked] = useState(false)

    const svgClick = () => {
        if (!clicked) {
            
        const numRegex = /[0-9]/gm
        const MRegex = /(M[^A-Z]*)/gm
        const LRegex = /(L[^A-Z]*)/gm
        const QRegex = /(Q[^A-Z]*)/gm
        const ZRegex = /(.[^Z]+)/gm
        const points = myPath.split(' ')
        const newPoints = points.filter((x,i)=>i%2==0)
        // const newPath = newPoints.join(' ')
        const newPath = myPath
        .replace(MRegex,(s)=>{
            const nums = s.substr(2).split(' ')
            const newNums = nums.map(n=>n+(Math.random()*100-50))
            const newStr = newNums.join(' ')
            return `M 10 10`
        })
        .replace(LRegex,(s)=>{
            const nums = s.substr(2).split(' ')
            const newNums = nums.map(n=>n+(Math.random()*10-5))
            const newStr = newNums.join(' ')
            return `L 10 10`
        })
        .replace(QRegex,(s)=>{
            const nums = s.substr(2).split(' ')
            const newNums = nums.map(n=>n+(Math.random()*10-5))
            const newStr = newNums.join(' ')
            return ``
        })
        // const newPath = myPath.split(ZRegex).slice(1).join('')
        setPath('newPath')
    } else {
        setPath(mySVGJSON.path)
    }
        setClicked(clicked)
    }

    return (
        <Box className={classes.mySVG} onClick={svgClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <path className={classes.mySVGPath} d={myPath}/>
    </svg>
        </Box>
    )
}

export default App