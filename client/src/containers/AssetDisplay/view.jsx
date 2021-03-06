import React from 'react';
import Row from '@components/Row';
import ProgressBar from '@components/ProgressBar';
import { LOCAL_CHECK, UNAVAILABLE, ERROR, AVAILABLE } from '../../constants/asset_display_states';
import createCanonicalLink from '../../../../utils/createCanonicalLink';

class AvailableContent extends React.Component {
  render () {
    const {contentType, sourceUrl, name, thumbnail} = this.props;
    switch (contentType) {
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
      case 'image/gif':
        return (
          <img
            className='asset-image'
            src={sourceUrl}
            alt={name}
          />
        );
      case 'video/mp4':
        return (
          <video
            className='asset-video'
            controls poster={thumbnail}
          >
            <source
              src={sourceUrl}
            />
            <p>Your browser does not support the <code>video</code> element.</p>
          </video>
        );
      default:
        return (
          <p>Unsupported content type</p>
        );
    }
  }
}

class AssetDisplay extends React.Component {
  componentDidMount () {
    const { asset: { claimData: { name, claimId } } } = this.props;
    this.props.onFileRequest(name, claimId);
  }
  render () {
    const { status, error, asset } = this.props;
    const { name, claimData: { claimId, contentType, thumbnail, outpoint, pending } } = asset;
    // the outpoint is added to force the browser to re-download the asset after an update
    // issue: https://github.com/lbryio/spee.ch/issues/607
    let fileExt;
    if (typeof contentType === 'string') {
      fileExt = contentType.split('/')[1] || 'jpg';
    }
    const sourceUrl = `${createCanonicalLink({ asset: asset.claimData })}.${fileExt}?${outpoint}`;
    return (
      <div className={'asset-display'}>
        {(status === LOCAL_CHECK) &&
        <div>
          <p>Checking to see if Spee.ch has your asset locally...</p>
        </div>
        }
        {(status === UNAVAILABLE) &&
        <div>
          <p>Sit tight, we're searching the LBRY blockchain for your asset!</p>
          <ProgressBar size={12} />
          <p>Curious what magic is happening here? <a className='link--primary' target='blank' href='https://lbry.io/faq/what-is-lbry'>Learn more.</a></p>
        </div>
        }
        {(status === ERROR) && (
          pending ? (
            <div>
              <p>This content is pending confirmation on the LBRY blockchain. It should be available in the next few minutes, please check back or refresh.</p>
            </div>
          ) : (
            <div>
              <Row>
                <p>Unfortunately, we couldn't download your asset from LBRY.  You can help us out by sharing the following error message in the <a className='link--primary' href='https://chat.lbry.io' target='_blank'>LBRY discord</a>.</p>
              </Row>
              <Row>
                <p id='error-message'><i>{error}</i></p>
              </Row>
            </div>
          )
        )}
        {(status === AVAILABLE) &&
        <AvailableContent
          contentType={contentType}
          sourceUrl={sourceUrl}
          name={name}
          thumbnail={thumbnail}
        />
        }
      </div>
    );
  }
};

export default AssetDisplay;
