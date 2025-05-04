import { useCallback } from 'react';

const VoiceMessageRenderer = (props) => {
  const { message } = props;

  const renderVoiceAttachment = useCallback(() => {
    const hasVoiceAttachment = message.attachments?.some(
      (attachment) => attachment.type === 'audio'
    );

    if (!hasVoiceAttachment) return null;

    const audioAttachment = message.attachments.find(
      (attachment) => attachment.type === 'audio'
    );

    if (!audioAttachment || !audioAttachment.asset_url) return null;

    return (
      <div className="voice-message-container my-1">
        <audio 
          src={audioAttachment.asset_url} 
          controls 
          className="rounded-lg max-w-[240px]"
        />
      </div>
    );
  }, [message.attachments]);

  return (
    <div>
      {renderVoiceAttachment()}
      <div>{props.children}</div>
    </div>
  );
};

export default VoiceMessageRenderer; 