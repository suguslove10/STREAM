import { useState } from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';
import { Mic, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = '/api';

const VoiceMessageInput = ({ channel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleRecordingComplete = (blob) => {
    setAudioBlob(blob);
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setIsRecording(false);
  };

  const cancelRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const sendVoiceMessage = async () => {
    if (!audioBlob || !channel) return;

    try {
      setIsSending(true);
      // Create a FormData object to upload the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-message.mp3');
      formData.append('channelId', channel.id);

      // Send the audio to our backend API
      const response = await axios.post(`${API_BASE_URL}/chat/voice-message`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // Get the URL of the uploaded file
      const audioFileUrl = response.data.fileUrl;

      // Send a message with the audio attachment
      await channel.sendMessage({
        text: 'Voice message',
        attachments: [
          {
            type: 'audio',
            asset_url: audioFileUrl,
            title: 'Voice Message',
            mime_type: audioBlob.type,
          },
        ],
      });

      // Reset the state
      cancelRecording();
      toast.success('Voice message sent!');
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast.error('Failed to send voice message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="voice-recorder-container">
      {!audioUrl ? (
        <div className="flex items-center">
          <button
            className={`btn btn-circle ${isRecording ? 'btn-error' : 'btn-primary'}`}
            onClick={() => setIsRecording(!isRecording)}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <Mic size={20} />
          </button>
          {isRecording && (
            <div className="ml-2 flex items-center">
              <span className="animate-pulse text-error font-medium">Recording...</span>
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
                downloadOnSavePress={false}
                downloadFileExtension="mp3"
                showVisualizer={true}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <audio src={audioUrl} controls className="h-10 w-44" />
          <button
            className="btn btn-circle btn-sm btn-error"
            onClick={cancelRecording}
            aria-label="Cancel"
            disabled={isSending}
          >
            <X size={16} />
          </button>
          <button
            className={`btn btn-circle btn-sm btn-primary ${isSending ? 'loading' : ''}`}
            onClick={sendVoiceMessage}
            aria-label="Send"
            disabled={isSending}
          >
            {!isSending && <Send size={16} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceMessageInput; 