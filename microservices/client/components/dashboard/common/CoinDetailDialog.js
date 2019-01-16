import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CoinDetailView from '../subcomponents/CoinDetailView';

const styleButton = {
  background: '#449ff7',
  borderRadius: '20px',
  border: 0,
  fontSize: '10px',
  color: 'white',
  padding: '0 20px',
};
const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing.unit * 2,
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing.unit,
  },
});

class CoinDetailDialog extends React.Component {
  static propTypes = {
    coin: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  state = {
    open: false,
    fullWidth: true,
    maxWidth: 'lg',
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { coin } = this.props;
    return (
      <React.Fragment>
        <Button style={{ ...styleButton}} onClick={this.handleClickOpen}>
          See more
        </Button>
        <Dialog
          fullWidth={true}
          maxWidth={this.state.maxWidth}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogContent>
            <CoinDetailView coin={coin}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(CoinDetailDialog);