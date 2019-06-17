import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Typography, Fade, Divider } from '@material-ui/core';
import Layout from '../src/components/Layout';

export class Settings extends Component {

  render() {
    return (
      <Fade in={true} timeout={{ enter: 2 * 1000, exit: 5 * 1000 }}>
        <Layout>
          <Grid container spacing={16}>
            <Grid item xs={12}> 
              <Typography variant="h4">
                Settings
              </Typography>
              <Divider/>
            </Grid>
          </Grid>
        </Layout>
      </Fade>
      
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
