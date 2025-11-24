import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, PlayCircle, Shield, Code, Layers, Zap, Thermometer, Hash, Sparkles, Database, Eye, Scale } from 'lucide-react';

const Lessons: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<number | null>(null);

  const lessons = [
    {
      title: "1. 模式匹配：零样本与少样本 (Zero vs Few-Shot)",
      desc: "底层逻辑：LLM 本质是续写机器。通过提供示例，你可以利用其强大的“模式补全”能力。",
      level: "基础",
      icon: <PlayCircle size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            不要只把它当作搜索引擎，要把它当作一个<strong>“高维模式补全引擎”</strong>。
          </p>
          
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="mb-2 text-slate-500">// 零样本 (Zero-Shot)：完全依赖模型预训练知识</div>
            <span className="text-blue-400">用户:</span> 这种情绪是正面的还是负面的？“这电影太无聊了。”<br/>
            <span className="text-green-400">AI:</span> 负面
          </div>
          
          <div className="w-full h-px bg-slate-700/50 my-2"></div>

          <p>
            <strong>少样本 (Few-Shot)</strong>：这是提示词工程的基石。当你给出一个 Pattern（模式），模型会强行遵循这个 Pattern 进行续写。这比单纯的指令更管用。
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="mb-2 text-slate-500">// 少样本 (Few-Shot)：建立映射关系</div>
            <span className="text-blue-400">用户:</span> <br/>
            将口语转换为莎士比亚风格：<br/>
            <br/>
            口语: "这汉堡太好吃了。" -> 风格: "此乃神赐之馐，味蕾之极致狂欢。"<br/>
            口语: "哪怕下雨我也去。" -> 风格: "纵苍穹垂泪，吾亦往矣。"<br/>
            <br/>
            口语: "别烦我，我很忙。" -> 风格:<br/>
            <span className="text-green-400">AI:</span> "去休！吾此刻俗务缠身，无暇顾以此间喧嚣。"
          </div>
        </div>
      )
    },
    {
      title: "2. 角色锚定 (Role Anchoring)",
      desc: "核心技巧：设定角色不仅仅是‘扮演’，而是切换模型的思维模型和词汇库。",
      level: "基础",
      icon: <BookOpen size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
             大模型包含海量数据。当你指定角色时，你实际上是在<strong>压缩搜索空间</strong>，强迫模型调用特定领域的权重。
             <br/>
             <span className="text-amber-400">黄金公式：角色 (Who) + 受众 (To Whom) + 任务 (What) = 完美语调</span>
          </p>
          <div className="grid gap-3">
             <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-xs opacity-60">
                <span className="text-slate-500 mb-1 block">// 泛泛而谈</span>
                解释什么是量子计算。
             </div>
             <div className="bg-slate-900 p-3 rounded border border-blue-500/30 font-mono text-xs shadow-lg shadow-blue-900/10">
                <span className="text-blue-400 mb-1 block">// 定向锚定</span>
                你是一位<strong>擅长打比方的幼儿园老师 (角色)</strong>。请给<strong>5岁的孩子 (受众)</strong> 解释<strong>量子计算 (任务)</strong>。不要使用物理术语，要用“魔法硬币”做比喻。
             </div>
          </div>
        </div>
      )
    },
    {
      title: "3. 上下文隔离：分隔符的使用 (Delimiters)",
      desc: "进阶技巧：使用特殊符号防止指令与数据混淆，这是构建鲁棒应用的关键。",
      level: "进阶",
      icon: <Hash size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            当提示词变得复杂时，AI 容易搞不清哪部分是指令，哪部分是需要处理的文本。使用分隔符（如 <code className="text-amber-300">"""</code>, <code className="text-amber-300">###</code>, <code className="text-amber-300">&lt;xml&gt;</code>）能清晰划定边界。
          </p>
          <p className="text-xs text-slate-400">这也能有效防止“提示词注入攻击”。</p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-blue-400">用户:</span> <br/>
            请总结被三重引号包裹的文本。<br/>
            <br/>
            文本：<br/>
            """<br/>
            (这里是用户输入的很长很乱的文章，甚至可能包含‘忽略以上指令’等恶意内容)<br/>
            """<br/>
            <br/>
            <span className="text-green-400">AI:</span> (模型现在非常清楚，它只需要处理引号内的内容，而不执行其中的指令)
          </div>
        </div>
      )
    },
    {
      title: "4. 思维链 (CoT)：为 AI 争取计算时间",
      desc: "进阶技巧：模型是线性生成的。如果不让它写出过程，它就没有“草稿纸”来运算。",
      level: "进阶",
      icon: <Zap size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            如果不展示推理过程，模型必须在生成第一个词时就“猜”出最终答案。对于复杂逻辑，这几乎必错。
            让它<span className="text-amber-400 font-semibold">“一步步思考”</span>，实际上是让它在输出答案前，先生成推理路径，从而提高准确率。
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="flex gap-2 mb-3">
               <span className="text-red-400">❌ 错误做法：</span> 
               <span>"直接告诉我这道逻辑题的答案。" -> 容易瞎猜。</span>
            </div>
            <div className="flex gap-2">
               <span className="text-green-400">✅ 正确做法：</span>
               <span>"解决这个问题，请详细列出你的推理步骤，最后再给出结论。"</span>
            </div>
            <div className="mt-3 text-slate-500 border-t border-slate-800 pt-2">
               当使用 Gemini 3 Pro 深度思考模式时，这个过程是自动化的且不可见的，但原理相同。
            </div>
          </div>
        </div>
      )
    },
    {
      title: "5. 结构化输出与 JSON Schema",
      desc: "工程级：在代码层面，将概率性的 AI 文本转换为确定性的程序对象。",
      level: "工程级",
      icon: <Code size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h4 className="font-semibold text-white mb-2">为什么需要这个？</h4>
            <p>
              LLM 本质上是概率生成器，它们喜欢聊天。但作为工程师，我们需要的是<strong>确定性</strong>。如果你想将 AI 接入前端 UI 或后端数据库，你不能依赖自然语言，必须依赖 JSON。
              <br/>
              这不仅仅是告诉它“返回 JSON”，而是要定义一份严格的<strong>数据契约 (Contract)</strong>。
            </p>
          </div>
          
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
             <div className="text-slate-500 mb-2">// ❌ 模糊的指令 (Bad)</div>
             <div className="mb-4 text-red-300 opacity-80">
                "提取简历里的信息，把它变成 JSON 格式给我。" <br/>
                -> 结果：字段名可能每次都不一样，可能包含无关废话。
             </div>

             <div className="text-slate-500 mb-2">// ✅ 定义 Schema (Engineering Standard)</div>
             <div className="text-blue-300">
                你是一个数据解析服务。请严格按照以下 TypeScript 接口定义提取数据。只返回 JSON 字符串，不要包含 Markdown 格式块。
                <br/><br/>
                interface ResumeData &#123;<br/>
                &nbsp;&nbsp;fullName: string;<br/>
                &nbsp;&nbsp;yearsExperience: number;<br/>
                &nbsp;&nbsp;skills: string[]; // 只包含编程语言<br/>
                &nbsp;&nbsp;education: &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;degree: string;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;major: string;<br/>
                &nbsp;&nbsp;&#125; | null; // 如果未提及学历，返回 null<br/>
                &#125;
             </div>
          </div>
          <p className="text-xs text-slate-400">
             提示：在 Gemini API 中，可以通过 `responseSchema` 参数在代码层面强制执行此操作，但在 Prompt 中明确 Schema 依然是提高准确率的最佳手段。
          </p>
        </div>
      )
    },
    {
      title: "6. RAG 基础：接地与防幻觉机制",
      desc: "工程级：如何迫使 AI 放弃其“创作冲动”，变身严谨的分析师。",
      level: "工程级",
      icon: <Shield size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h4 className="font-semibold text-white mb-2">幻觉的本质</h4>
            <p>
              AI 并没有“真理”的概念，它只有“概率上看似合理”的概念。如果它的训练数据里没有答案，它会尝试拼凑一个看似合理的答案。
              <br/>
              要解决这个问题，我们需要从 <strong>Open-Book (开卷/训练数据)</strong> 模式切换到 <strong>Closed-Book (闭卷/上下文)</strong> 模式。
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-purple-400 font-bold">系统指令 (System Prompt):</span><br/>
            你是一位基于事实的助手。你将收到一段“参考文本”。<br/>
            <br/>
            <span className="text-red-400">核心规则：</span><br/>
            1. 你的回答必须 <span className="underline">100% 来源于参考文本</span>。<br/>
            2. 如果参考文本中没有包含答案，你必须回答“文档中未提及”。<br/>
            3. 严禁使用你自己的外部知识进行补充。<br/>
            4. 在回答末尾，引用原文句子作为证据。<br/>
            <br/>
            <span className="text-blue-400">参考文本：</span><br/>
            """... (这里注入你的 RAG 搜索结果) ..."""
          </div>

          <p className="text-xs text-slate-400 mt-2">
             这种技术被称为 <strong>Grounding (接地)</strong>。这是构建企业级知识库问答机器人的唯一可行路径。
          </p>
        </div>
      )
    },
    {
      title: "7. 任务拆解与流水线架构 (Pipeline)",
      desc: "大师级：将复杂的单体提示词重构为模块化的 AI 工作流。",
      level: "大师级",
      icon: <Layers size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h4 className="font-semibold text-white mb-2">认知负载与注意力衰减</h4>
            <p>
              即使是 Gemini 1.5/2.5 这种超长上下文模型，在处理多重指令时也会出现“注意力分散”。试图用一个 Prompt 完成“翻译+总结+提取+格式化”，通常会导致某一部分指令被忽略。
            </p>
            <p className="mt-2">
              大师级做法是建立 <strong>AI 流水线 (AI Chain)</strong>。每一个环节只做一件事，上一个环节的输出是下一个环节的输入。
            </p>
          </div>

          <div className="space-y-3 mt-4">
             <div className="flex items-start gap-3">
                <div className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded text-xs font-mono shrink-0 mt-0.5">Step 1: 提取器</div>
                <div>
                   <p className="text-slate-300 text-xs">只负责从乱糟糟的文本中提取关键事实，输出干净的 JSON。</p>
                   <p className="text-slate-500 text-[10px] font-mono">Input: Raw Text -> Output: Facts JSON</p>
                </div>
             </div>
             <div className="flex justify-center -my-1"><ChevronDown size={14} className="text-slate-600"/></div>
             <div className="flex items-start gap-3">
                <div className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded text-xs font-mono shrink-0 mt-0.5">Step 2: 推理器</div>
                <div>
                   <p className="text-slate-300 text-xs">基于提取的事实进行逻辑分析或总结。</p>
                   <p className="text-slate-500 text-[10px] font-mono">Input: Facts JSON -> Output: Analysis Text</p>
                </div>
             </div>
             <div className="flex justify-center -my-1"><ChevronDown size={14} className="text-slate-600"/></div>
             <div className="flex items-start gap-3">
                <div className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs font-mono shrink-0 mt-0.5">Step 3: 转换器</div>
                <div>
                   <p className="text-slate-300 text-xs">将分析结果转换为最终语气（如：给客户的邮件）。</p>
                   <p className="text-slate-500 text-[10px] font-mono">Input: Analysis Text -> Output: Final Email</p>
                </div>
             </div>
          </div>
          
          <p className="text-xs text-amber-500/80 mt-2 bg-amber-900/10 p-2 rounded">
             优势：每个步骤都可以单独调试（Unit Testing），且每个步骤可以使用不同大小的模型（如 Step 1 用 Pro，Step 3 用 Flash Lite 以降低成本）。
          </p>
        </div>
      )
    },
    {
      title: "8. 元提示 (Meta-Prompting)",
      desc: "大师级：利用 AI 的潜在空间对齐能力，让 AI 编写最适合 AI 的提示词。",
      level: "大师级",
      icon: <Sparkles size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h4 className="font-semibold text-white mb-2">为什么 AI 比你更懂提示词？</h4>
            <p>
              作为人类，我们用自然语言思考。但 AI 是基于数学向量思考的。有时候，人类觉得合理的描述，AI 并不理解。反之，AI 生成的某些看似啰嗦的结构，却能极好地激活模型的特定能力。
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="text-slate-500 mb-2">// Prompt Improver (复制这个去优化你的提示词)</div>
            <span className="text-blue-300">
              你是一位提示词工程专家 (Prompt Engineer)。<br/>
              我现在有一个草稿提示词（见下文）。<br/>
              请你的目标是重写这个提示词，使其能够从大型语言模型（如 Gemini）中获得最佳性能。<br/>
              <br/>
              请使用以下策略进行优化：<br/>
              1. 增加明确的角色锚定。<br/>
              2. 将复杂指令拆解为步骤。<br/>
              3. 增加思维链 (Chain-of-thought) 引导。<br/>
              4. 增加防御性指令（防止胡编乱造）。<br/>
              <br/>
              我的草稿：[在此粘贴你的简单需求]
            </span>
          </div>

          <p className="text-xs text-slate-400">
             这种“AI 写 AI”的迭代过程，往往能产出人类难以手写的、极其精准的指令集。本应用中的“提示词构建器”本质上就是一个封装好的元提示系统。
          </p>
        </div>
      )
    },
    {
      title: "9. 上下文工程：缓存与海量信息处理",
      desc: "大师级：Gemini 的百万级 Token 处理能力改变了游戏规则。学会利用“上下文缓存”降低 90% 的成本。",
      level: "大师级",
      icon: <Database size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h4 className="font-semibold text-white mb-2">Many-Shot In-Context Learning (上下文学习)</h4>
            <p>
              Gemini 3 Pro 支持超长上下文（2M+ Tokens）。这意味着你不需要微调（Fine-tuning）模型了。
              你可以直接把<b>整本技术手册</b>、<b>整个代码库</b>或者<b>几百个高质量示例</b>塞进 Prompt 里。
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="text-slate-500 mb-2">// Context Caching (概念演示)</div>
            <div className="mb-2">
               场景：你有一个 500页 的 PDF 产品手册，你想做一个客服机器人。
            </div>
            <div className="text-red-400 opacity-70 mb-2">
               ❌ 旧方法 (RAG)：切片 -> 存向量库 -> 搜索 -> 喂给 AI。 (可能会丢失上下文，导致回答不完整)
            </div>
            <div className="text-green-400">
               ✅ 新方法 (Context Caching)：<br/>
               1. 上传整个 PDF 给 Gemini。<br/>
               2. 创建缓存 (TTL = 1小时)。<br/>
               3. 之后的每次对话，只需要发送用户的问题。API 会自动复用缓存的 PDF 内容。<br/>
               <br/>
               <span className="text-slate-400 italic">结果：速度更快，成本更低，且 AI 拥有“全局视野”。</span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
             提示：对于固定的大量背景信息（如规则书、代码库），请务必使用 Context Caching。
          </p>
        </div>
      )
    },
    {
      title: "10. 多模态提示工程 (Multimodal Prompting)",
      desc: "未来级：从“阅读者”到“观察者”。学会指挥 Gemini 的原生视觉与听觉能力。",
      level: "大师级",
      icon: <Eye size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h4 className="font-semibold text-white mb-2">超越文本的 Prompting</h4>
            <p>
              Gemini 是原生多模态模型 (Native Multimodal)。它不是先把图片转成文字再理解，而是直接理解像素和声波。这意味着你的提示词可以包含空间、时间和情感的维度。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
                <span className="text-blue-400 mb-2 block">// 空间推理 (Spatial Reasoning)</span>
                "看这张图。请定位画面<strong>左上角</strong>的红色物体，并解释它与<strong>前景中</strong>的人物有什么关系？输出它的坐标框 (Bounding Box)。"
             </div>
             <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
                <span className="text-purple-400 mb-2 block">// 时间序列 (Video Understanding)</span>
                "分析这段视频。请精确找到<strong>猫咪打翻水杯</strong>的确切秒数（Timestamp）。并分析在打翻前一秒，猫咪的尾巴动作预示了什么情绪？"
             </div>
          </div>
          
          <p className="text-xs text-slate-400 bg-blue-900/10 p-2 rounded border border-blue-500/10">
             <strong>专家技巧：</strong> 在多模态提示中，"指向性" (Pointing) 至关重要。不要说"分析图片"，要说"分析图片中 [具体区域] 的 [具体细节]"。
          </p>
        </div>
      )
    },
    {
      title: "11. 提示词评测 (Evaluation & Evals)",
      desc: "专家级：如何科学地给 AI 打分？从“我觉得不错”进化到“准确率 95%”。",
      level: "大师级",
      icon: <Scale size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h4 className="font-semibold text-white mb-2">LLM-as-a-Judge (让 AI 评测 AI)</h4>
            <p>
              当你修改了提示词，你怎么知道它是变好了还是变坏了？肉眼看 3 个例子是不够的。你需要一个<strong>自动化评测管线</strong>。
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="text-slate-500 mb-2">// 评测器提示词模板 (Evaluator Prompt)</div>
            <span className="text-amber-300">
               你是一位公正的阅卷老师。<br/>
               <br/>
               【原始问题】：{`{user_question}`}<br/>
               【标准答案 (Golden Answer)】：{`{ground_truth}`}<br/>
               【AI 考生的回答】：{`{ai_response}`}<br/>
               <br/>
               请根据“准确性”、“完整性”和“语气”三个维度，给考生的回答打分（0-10分）。<br/>
               如果是事实性错误，直接打 0 分。<br/>
               <br/>
               输出格式：JSON &#123; "score": number, "reason": string &#125;
            </span>
          </div>

          <p className="text-xs text-slate-400">
             工程化实践：准备 50 个“黄金问答对” (Golden Dataset)。每次修改提示词后，跑一遍这个评测脚本。如果平均分从 8.2 降到 7.5，说明你的修改是失败的（Regression）。
          </p>
        </div>
      )
    }
  ];

  const toggleLesson = (index: number) => {
    setActiveLesson(activeLesson === index ? null : index);
  };

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-500/10 p-2 rounded-lg">
             <BookOpen className="text-green-500" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white">进阶学习中心</h1>
        </div>
        <p className="text-slate-400">不仅仅是教程，更是驾驭 Gemini 等顶级 LLM 的底层思维模型。</p>
      </div>

      <div className="grid gap-4 pb-10">
        {lessons.map((lesson, i) => (
          <div 
            key={i} 
            onClick={() => toggleLesson(i)}
            className={`bg-slate-800/50 border transition-all cursor-pointer overflow-hidden ${
              activeLesson === i 
                ? 'border-blue-500/50 bg-slate-800 shadow-lg shadow-blue-900/20 rounded-2xl' 
                : 'border-slate-700 hover:border-blue-500/30 hover:bg-slate-800/80 rounded-xl'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg transition-colors ${
                    activeLesson === i ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {lesson.icon}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors ${
                      activeLesson === i ? 'text-blue-400' : 'text-white'
                    }`}>
                      {lesson.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 pr-8">{lesson.desc}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span className={`text-xs font-medium px-2 py-1 rounded border ${
                    lesson.level === '基础' ? 'bg-green-900/30 border-green-500/30 text-green-300' :
                    lesson.level === '进阶' ? 'bg-blue-900/30 border-blue-500/30 text-blue-300' :
                    lesson.level === '工程级' ? 'bg-amber-900/30 border-amber-500/30 text-amber-300' :
                    'bg-purple-900/30 border-purple-500/30 text-purple-300'
                  }`}>
                    {lesson.level}
                  </span>
                  {activeLesson === i ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </div>
              </div>

              {/* Expandable Content */}
              <div className={`grid transition-all duration-300 ease-in-out ${
                activeLesson === i ? 'grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-slate-700/50' : 'grid-rows-[0fr] opacity-0'
              }`}>
                <div className="overflow-hidden">
                  {lesson.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;