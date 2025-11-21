import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, PlayCircle, Shield, Code, Layers, Zap, Thermometer } from 'lucide-react';

const Lessons: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<number | null>(null);

  const lessons = [
    {
      title: "1. 零样本 vs 少样本 (Zero-Shot vs Few-Shot)",
      desc: "基础：了解直接提问与提供示例之间的区别，以及何时使用它们。",
      level: "初级",
      icon: <PlayCircle size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            <strong>零样本提示 (Zero-Shot)</strong> 是指直接要求 AI 执行任务，而不提供任何示例。对于 AI 已经非常熟悉的常见任务（如翻译、总结），这种方法非常有效。
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="mb-2 opacity-50">// 零样本示例</div>
            <span className="text-blue-400">用户:</span> 请将"Hello World"翻译成西班牙语。<br/>
            <span className="text-green-400">AI:</span> Hola Mundo
          </div>
          
          <div className="w-full h-px bg-slate-700/50 my-2"></div>

          <p>
            <strong>少样本提示 (Few-Shot)</strong> 涉及在提示词中提供一个或多个示例（“样本”），让模型模仿其模式。当模型无法准确理解复杂指令，或你需要特定的输出格式时，这至关重要。
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="mb-2 opacity-50">// 少样本示例 (One-Shot / Few-Shot)</div>
            <span className="text-blue-400">用户:</span> <br/>
            任务：将客户评论分类为 [正面, 负面, 中立]。<br/>
            <br/>
            评论: "这简直是浪费钱。" -> 负面<br/>
            评论: "还可以，没什么特别的。" -> 中立<br/>
            评论: "我完全爱上它了！" -> 正面<br/>
            <br/>
            评论: "物流太慢了，但产品质量不错。" -> <br/>
            <span className="text-green-400">AI:</span> 中立
          </div>
        </div>
      )
    },
    {
      title: "2. 角色提示 (Role Prompting)",
      desc: "基础：通过分配特定角色（如“资深律师”）来引导语气和专业知识。",
      level: "初级",
      icon: <BookOpen size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
             AI 模型训练于海量数据。为它指定一个<strong>角色 (Persona)</strong> 可以帮助它缩小搜索空间，采用特定的语气、词汇和思维方式，从而生成更专业的回答。
          </p>
          <div className="grid gap-3">
             <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-xs opacity-70 hover:opacity-100 transition-opacity">
                <span className="text-slate-500 mb-1 block">// 弱提示</span>
                写一个关于新款跑鞋的广告。
             </div>
             <div className="bg-slate-900 p-3 rounded border border-blue-500/30 font-mono text-xs shadow-lg shadow-blue-900/10">
                <span className="text-blue-400 mb-1 block">// 强提示 (带角色)</span>
                你是一位拥有 20 年经验的耐克<strong>顶级营销文案撰稿人</strong>。请写一个关于新款跑鞋的广告，语气要<strong>充满激情、鼓舞人心</strong>，主要针对准备跑马拉松的运动员。
             </div>
          </div>
        </div>
      )
    },
    {
      title: "3. 思维链 (Chain of Thought)",
      desc: "中级：引导模型逐步推理以处理复杂逻辑，大幅减少数学或推理错误。",
      level: "中级",
      icon: <Zap size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            <strong>思维链 (CoT)</strong> 是一种提示技术，鼓励模型在给出最终答案之前解释其推理过程。这对于解决数学问题、逻辑谜题和复杂推理任务至关重要。
          </p>
          <p>
            最简单的实现方式是在提示词末尾添加一句咒语：<span className="text-amber-400 font-semibold">“请一步步思考 (Let's think step by step)”</span>。
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-blue-400">用户:</span> <br/>
            我去市场买了10个苹果。我吃了2个，给了邻居3个。然后我又去买了5个。我现在有几个苹果？<br/>
            <strong>请一步步思考。</strong>
            <br/><br/>
            <span className="text-green-400">AI:</span> <br/>
            好的，我们来一步步计算：<br/>
            1. 起始数量：10 个苹果<br/>
            2. 吃了 2 个：10 - 2 = 8 个<br/>
            3. 给了邻居 3 个：8 - 3 = 5 个<br/>
            4. 又买了 5 个：5 + 5 = 10 个<br/>
            <br/>
            答案：你现在有 10 个苹果。
          </div>
        </div>
      )
    },
    {
      title: "4. 结构化输出 (Structured Output)",
      desc: "中级：如何强制 AI 生成 JSON、Markdown 或 CSV 等易于代码处理的格式。",
      level: "中级",
      icon: <Code size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            在开发应用时，我们通常不需要 AI 写作文，而是需要数据。通过明确指定<strong>输出模式 (Schema)</strong> 或提供 JSON 示例，可以确保 AI 的输出能被代码直接解析。
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-blue-400">用户:</span> <br/>
            请从以下文本中提取用户信息。仅输出 JSON 格式，不要包含 markdown 标记或解释。<br/>
            <br/>
            文本："用户 John Doe，30岁，住在纽约，邮箱是 john@example.com"<br/>
            <br/>
            格式要求: &#123; "name": string, "age": number, "email": string &#125;
            <br/><br/>
            <span className="text-green-400">AI:</span> <br/>
            &#123;<br/>
            &nbsp;&nbsp;"name": "John Doe",<br/>
            &nbsp;&nbsp;"age": 30,<br/>
            &nbsp;&nbsp;"email": "john@example.com"<br/>
            &#125;
          </div>
        </div>
      )
    },
    {
      title: "5. 降低幻觉 (Reducing Hallucinations)",
      desc: "高级：教导 AI 在不知道答案时承认，而不是编造事实。",
      level: "高级",
      icon: <Shield size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            “幻觉”是指 AI 自信地陈述错误事实。通过限制 AI 的知识范围，强制其引用来源，或允许其说“我不知道”，可以显著降低风险。
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>明确指示：<strong>“如果你不知道答案，请直接说‘不知道’，不要编造。”</strong></li>
            <li>提供参考文本 (RAG)：要求 AI <strong>“仅根据以下提供的文章回答”</strong>。</li>
          </ul>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs mt-2">
            <span className="text-blue-400">用户:</span> <br/>
            仅根据以下背景信息回答问题。如果文中未提及，请回答“文中未提及”。<br/>
            <br/>
            背景信息：[公司2023年财报数据...]<br/>
            问题：公司 CEO 最喜欢什么颜色的袜子？
            <br/><br/>
            <span className="text-green-400">AI:</span> 文中未提及。
          </div>
        </div>
      )
    },
    {
      title: "6. 任务拆解 (Task Decomposition)",
      desc: "高级：处理超长复杂任务的终极秘诀——分而治之。",
      level: "高级",
      icon: <Layers size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            如果你给 AI 一个包含 10 个步骤的复杂指令，它可能会漏掉中间的步骤。更好的方法是将任务拆解为子任务，或者要求 AI 列出计划。
          </p>
          <div className="grid gap-3">
             <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-xs opacity-70">
                <span className="text-red-400 block mb-1">// 错误示范 (一次性塞入太多指令)</span>
                阅读这篇论文，总结摘要，提取关键词，翻译成法语，然后写一篇博客文章评论它，并给出一个评分。
             </div>
             <div className="bg-slate-900 p-3 rounded border border-blue-500/30 font-mono text-xs">
                <span className="text-blue-400 block mb-1">// 优化示范 (分步引导)</span>
                任务：论文分析<br/>
                步骤 1：请先阅读并总结这篇论文的核心论点。<br/>
                步骤 2：基于上述总结，提取 5 个关键术语。<br/>
                步骤 3：根据总结和术语，撰写一篇中文博客文章。
             </div>
          </div>
        </div>
      )
    },
    {
      title: "7. 温度与参数 (Temperature & Parameters)",
      desc: "进阶：理解控制 AI 创造力与确定性的核心参数。",
      level: "进阶",
      icon: <Thermometer size={20} />,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            虽然通常是隐藏的，但 <strong>Temperature (温度)</strong> 是控制 AI 随机性的关键参数 (范围通常 0.0 - 1.0)。
          </p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-blue-900/20 p-3 rounded border border-blue-500/20">
              <div className="text-blue-400 font-bold mb-1">低温 (0.0 - 0.3)</div>
              <p className="text-xs text-slate-400">
                <strong>特点：</strong> 严谨、确定、重复性高。<br/>
                <strong>适用：</strong> 编程、数据提取、数学解答、事实问答。
              </p>
            </div>
            <div className="bg-amber-900/20 p-3 rounded border border-amber-500/20">
              <div className="text-amber-400 font-bold mb-1">高温 (0.7 - 1.0)</div>
              <p className="text-xs text-slate-400">
                <strong>特点：</strong> 创意、随机、多样化。<br/>
                <strong>适用：</strong> 写诗、创意写作、头脑风暴、角色扮演。
              </p>
            </div>
          </div>
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
          <h1 className="text-3xl font-bold text-white">学习中心</h1>
        </div>
        <p className="text-slate-400">从入门到精通：掌握提示词工程的核心概念与高级技巧。</p>
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
                    lesson.level === '初级' ? 'bg-green-900/30 border-green-500/30 text-green-300' :
                    lesson.level === '中级' ? 'bg-blue-900/30 border-blue-500/30 text-blue-300' :
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