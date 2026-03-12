import assistantImg from '@/assets/ai-assistant.png';
import './AIAssistant.css';

const AIAssistant = () => {
  return (
    <div className="ai-widget">
      <img src={assistantImg} alt="Udaani AI Assistant" className="ai-avatar" />
      <div className="ai-card">
        <h3 className="ai-name">Udaani</h3>
        <p className="ai-role">Your AI Assistant</p>
        <button className="ai-chat-btn">
          <span className="ai-chat-icon">💬</span>
          Chat Now
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
