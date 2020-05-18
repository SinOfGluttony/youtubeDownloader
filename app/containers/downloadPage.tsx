import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Downloader from '../components/Downloader';
import { updateUrl } from '../actions/url';
import { updateFormat } from '../actions/format';
import { updatePath } from '../actions/path';

function mapStateToProps(state: any) {
  return {
    url: state.url,
    format: state.format,
    path: state.path
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      updateUrl,
      updateFormat,
      updatePath
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Downloader);
