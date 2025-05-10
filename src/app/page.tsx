'use client';

import { useState } from 'react';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import ChatSidebar from './components/ChatSidebar';

// 简单的ID生成器函数，替代uuid
const generateId = () => {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
};

// 模拟历史会话数据
const initialSessions = [
  { id: '1', title: '注入攻击分析' },
  { id: '2', title: '后门利用分享' }
];

// 模拟初始消息
const initialMessages = [
  { id: '1', content: '告警数据：{\n  \"源IP\": \"10.10.10.1\",\n  \"源端口\": 42009.0,\n  \"目的IP\": \"172.17.0.2\",\n  \"目的端口\": 80,\n  \"协议\": \"http\",\n  \"通联次数\": 1,\n  \"载荷\": \"\",\n  \"响应内容\": \"HTTP/1.1 200 OK_x000D_\\nContent-Length: 60_x000D_\\n_x000D_\\n_x000D_\\n_x000D_\\n系统安装文件信息\\n安装路径\\nweb路径\\n文件名称\",\n  \"请求内容\": \"POST /testweb.php HTTP/1.1_x000D_\\nAccept-Encoding: identity_x000D_\\nHost: 1.2.1.1_x000D_\\nContent-Length: 0_x000D_\\nUser-Agent: python-urllib3/1.26.5_x000D_\\n_x000D_\\n_x000D_\\n_x000D_\\n\",\n  \"攻击类型大类\": \"事件漏洞\"\n}\n', isUser: true },
  { id: '2', content: '### 好的，我们来深入分析这份网络安全告警记录。\n\n---\n\n#### **1. 数据基本特征探索**\n\n* **访问者 (Source):**  \n  `10.10.10.1`，私有 IP 地址（RFC 1918），可能来自内部网络或经过 NAT 的设备。源端口 `36653` 是高位临时端口，符合客户端发起的常规行为。\n\n* **访问目标 (Destination):**  \n  `172.17.0.2`，私有 IP 地址，通常用于 Docker 容器或内部网络环境。目标端口 `8088` 是非标准 HTTP 端口，可能为特定应用或服务（如中间件、管理后台）开放。\n\n* **通信协议 (Protocol):**  \n  `http`，明文传输协议，可能存在配置缺陷或未启用 HTTPS。\n\n* **通联次数:**  \n  `1`，单次请求-响应交互，表明是一次孤立的探测或攻击尝试。\n\n* **访问内容 (Request):**  \n  * **请求方法与路径:**  \n    `GET /C6/JHsoft./C6/JHsoft.CostEAI/SAP_B1Config.aspx/?manage=1CostEAI/SAP_B1Config.aspx/?manage=1 HTTP/1.1`  \n    **关键异常点：**  \n    1. 路径中存在重复的 `/C6/JHsoft.CostEAI/SAP_B1Config.aspx` 和 `?manage=1` 参数，可能是拼写错误、路径遍历尝试或参数注入漏洞的利用。  \n    2. `JHsoft./C6/` 中的 `./` 可能试图通过路径拼接绕过权限控制。  \n  * **请求头:**  \n    - `User-Agent`: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0`，模拟合法浏览器，但需结合其他特征判断是否自动化工具。  \n    - `Host`: `192.168.40.130:8088`，与目的 IP `172.17.0.2` 不一致。**关键点：** 这可能是攻击者伪造 Host 头以触发反向代理或负载均衡器的配置漏洞（如 SSRF 或路径重定向）。\n\n* **返回结果 (Response):**  \n  * **状态码:** `HTTP/1.1 200 OK`，表明请求被成功处理，但内容可能包含敏感信息。  \n  * **响应体:**  \n    ```  \n    数据库服务器名  \n    数据库名  \n    ```  \n    **核心证据：** 响应直接返回了数据库服务器名称和数据库名称，属于**敏感信息泄露**。\n\n---\n\n#### **2. 深入挖掘与多角度分析**\n\n* **攻击意图与漏洞利用分析:**  \n  1. **异常路径构造：**  \n     请求路径中的重复 `/C6/JHsoft.CostEAI/SAP_B1Config.aspx` 和 `?manage=1` 参数可能是：  \n     - 对某个管理接口（如 `SAP_B1Config.aspx`）的暴力访问尝试，试图触发未授权访问或配置文件读取。  \n     - 利用 URL 解析漏洞（如路径遍历、参数注入）绕过权限控制。  \n  2. **Host 头操纵：**  \n     攻击者伪造 `Host: 192.168.40.130:8088` 可能是为了：  \n     - 触发反向代理服务器将请求转发到内网地址（SSRF 攻击）。  \n     - 测试目标是否因 Host 头配置错误而暴露内部服务。  \n  3. **敏感信息泄露：**  \n     响应直接返回数据库名称和服务器名，表明：  \n     - 目标应用存在配置错误（如未过滤敏感信息）。  \n     - 攻击者成功触发了某个未授权的接口或漏洞，导致服务器返回未经过滤的内部配置数据。\n\n* **攻击成功的关键证据：**  \n   - 响应体中明确泄露了数据库服务器名和数据库名，这是攻击者意图获取的核心敏感信息。  \n   - 状态码 `200 OK` 表明请求被服务器接受并处理，且未触发安全机制阻止或过滤响应内容。  \n\n* **攻击者行为模式：**  \n   - 使用合法 User-Agent 伪装成浏览器，降低检测概率。  \n   - 通过构造异常路径和 Host 头，测试目标系统的漏洞或配置缺陷。\n\n---\n\n#### **3. 可疑点总结与结论**\n\n* **a. 总结可疑点：**  \n   1. **异常路径构造：** 请求路径中重复的目录和参数可能用于触发漏洞或探测接口。  \n   2. **Host 头伪造：** 目标 IP 与 Host 头不一致，暗示 SSRF 或配置漏洞利用意图。  \n   3. **敏感信息泄露：** 响应直接返回数据库配置信息，表明漏洞存在且被成功利用。  \n   4. **攻击意图明确：** 攻击者通过单次请求获取了核心敏感数据，属于高价值信息泄露。\n\n* **b. 告警中标记的攻击类型是否准确？**  \n   * **不准确（需细化）**：  \n     原标记为“事件漏洞”过于宽泛。根据分析，本次攻击更具体属于：  \n     - **敏感信息泄露 (Sensitive Information Disclosure)**，因服务器直接返回了数据库配置信息。  \n     - 可能涉及 **路径遍历 (Path Traversal)** 或 **未授权访问 (Unauthorized Access)** 漏洞的利用。\n\n* **c. 攻击成功确认度等级是几级？**  \n   * **<||AttCR-10||>：确认攻击成功 (Confirmed Attack Success)**  \n     * 依据：  \n       - 响应体明确返回了攻击者意图获取的敏感信息（数据库服务器名和数据库名）。  \n       - 状态码 `200 OK` 和响应内容表明漏洞已被成功利用，且未被拦截或过滤。\n\n---\n\n#### **4. 给出全面结论**\n\n该告警记录显示了一次**成功的敏感信息泄露攻击**。攻击者通过构造异常的 HTTP 请求路径（重复的 `/C6/JHsoft.CostEAI/SAP_B1Config.aspx` 和 `?manage=1` 参数）和伪造 `Host` 头，触发了目标服务器的漏洞，直接返回了数据库服务器名称和数据库名称。关键结论如下：\n\n1. **攻击类型判断：**  \n   - 原标记的“事件漏洞”不准确，应细化为 **敏感信息泄露 (Sensitive Information Disclosure)** 或 **未授权访问 (Unauthorized Access)**。  \n   - 攻击路径可能涉及路径遍历或配置文件读取漏洞。\n\n2. **攻击成功确认：**  \n   - **<||AttCR-10||> 确认攻击成功**：响应直接泄露了敏感信息，攻击者明确达到了其目标。\n\n3. **风险与建议：**  \n   - **立即修复漏洞：** 检查 `/C6/JHsoft.CostEAI/SAP_B1Config.aspx` 接口是否存在未授权访问或配置错误，过滤异常请求路径。  \n   - **配置安全响应：** 禁止向客户端返回内部配置信息（如数据库名、服务器名），确保错误或响应内容不暴露敏感数据。  \n   - **审查 Host 头处理逻辑：** 确保反向代理或服务器不会因伪造的 Host 头导致 SSRF 或内网暴露。  \n   - **监控与防御：** 部署 WAF 规则拦截类似异常路径请求，并监控敏感接口的访问行为。\n\n此次攻击表明目标系统存在严重的配置缺陷或漏洞，需优先处理以避免进一步的数据泄露或后续攻击（如数据库凭证窃取、横向渗透）。', isUser: false }
];

export default function Home() {
  const [sessions, setSessions] = useState(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>('1');
  const [messages, setMessages] = useState(initialMessages);

  const handleSendMessage = (
    content: string, 
    options: {
      removeCss: boolean;
      removeGarbledText: boolean;
      autoDecode: boolean;
    }
  ) => {
    // 添加用户消息
    const userMessage = {
      id: generateId(),
      content,
      isUser: true
    };
    setMessages(prev => [...prev, userMessage]);

    // 处理选项的示例逻辑
    let processedContent = content;
    if (options.removeCss) {
      // 这里只是示例，实际应用中需要真正的CSS去除逻辑
      processedContent += " [已去除CSS]";
    }
    if (options.removeGarbledText) {
      // 这里只是示例，实际应用中需要真正的乱码去除逻辑
      processedContent += " [已去除乱码]";
    }
    if (options.autoDecode) {
      // 这里只是示例，实际应用中需要真正的解码逻辑
      processedContent += " [已自动解码]";
    }

    // 模拟机器人响应
    setTimeout(() => {
      const botMessage = {
        id: generateId(),
        content: `我收到了您的消息: "${processedContent}"。我是网络告警研判大模型，正在分析您的问题...`,
        isUser: false
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    // 在实际应用中，这里应该加载选定会话的消息
    // 这里我们只是简单地保持当前消息
  };

  return (
    <div className="flex flex-row h-screen bg-white">
      {/* 使用 ChatSidebar 组件 */}
      <ChatSidebar 
        sessions={sessions} 
        activeSessionId={activeSessionId} 
        onSelectSession={handleSelectSession} 
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-grow">
        {/* 使用 MessageList 组件 */}
        <MessageList messages={messages} />
        
        {/* 使用 ChatInput 组件 */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
