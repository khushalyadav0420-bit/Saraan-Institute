const App = (() => {
    const state = {
      activeTest: null,
      currentQuestionIndex: 0,
      studentAnswers: [],
      theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    };
  
    const TEST_DATABASE = {
      jee: createQuestionSet(
        "JEE",
        [
          {
            q: "Physics: Power ki SI unit kya hoti hai?",
            options: ["Joule", "Watt", "Newton", "Pascal"],
            correct: 1
          },
          {
            q: "Chemistry: Heavy water ka chemical formula kya hai?",
            options: ["H2O", "D2O", "H2O2", "CO2"],
            correct: 1
          },
          {
            q: "Maths: x² - 4 = 0 ke roots kya honge?",
            options: ["2, 3", "2, -2", "4, -4", "0, 4"],
            correct: 1
          },
          {
            q: "Physics: Velocity-time graph ka slope kya represent karta hai?",
            options: ["Distance", "Speed", "Acceleration", "Momentum"],
            correct: 2
          },
          {
            q: "Chemistry: pH value 7 hone ka matlab kya hai?",
            options: ["Acidic", "Basic", "Neutral", "Salt"],
            correct: 2
          },
          {
            q: "Maths: sin 90° ki value kya hai?",
            options: ["0", "1", "1/2", "√3/2"],
            correct: 1
          }
        ],
        60
      ),
  
      neet: createQuestionSet(
        "NEET",
        [
          {
            q: "Biology: Power house of the cell kise kaha jata hai?",
            options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"],
            correct: 2
          },
          {
            q: "Biology: Human blood ka normal pH value kitna hota hai?",
            options: ["6.4", "7.4", "8.4", "7.0"],
            correct: 1
          },
          {
            q: "Biology: Photosynthesis kis organelle me hota hai?",
            options: ["Mitochondria", "Chloroplast", "Lysosome", "Vacuole"],
            correct: 1
          },
          {
            q: "Chemistry: Water ka chemical formula kya hai?",
            options: ["H2O", "CO2", "NaCl", "O2"],
            correct: 0
          },
          {
            q: "Physics: Force ki SI unit kya hai?",
            options: ["Joule", "Newton", "Watt", "Volt"],
            correct: 1
          },
          {
            q: "Biology: Genetic material most commonly kya hota hai?",
            options: ["RNA", "Protein", "DNA", "Lipid"],
            correct: 2
          }
        ],
        60
      ),
  
      foundation: createQuestionSet(
        "Foundation",
        [
          {
            q: "Science: Matter ki teen common states kaunsi hain?",
            options: ["Solid, liquid, gas", "Metal, non-metal, gas", "Acid, base, salt", "Atom, molecule, ion"],
            correct: 0
          },
          {
            q: "Maths: 12 × 8 kitna hota hai?",
            options: ["84", "92", "96", "108"],
            correct: 2
          },
          {
            q: "Science: Plants apna food kaise banate hain?",
            options: ["Respiration", "Photosynthesis", "Digestion", "Excretion"],
            correct: 1
          },
          {
            q: "Maths: Triangle ke angles ka sum kitna hota hai?",
            options: ["90°", "180°", "270°", "360°"],
            correct: 1
          },
          {
            q: "Science: Human body ka blood pumping organ kaunsa hai?",
            options: ["Brain", "Liver", "Heart", "Lung"],
            correct: 2
          },
          {
            q: "Maths: 3/4 ka decimal form kya hai?",
            options: ["0.25", "0.5", "0.75", "1.25"],
            correct: 2
          }
        ],
        60
      )
    };
  
    const CHAT_KNOWLEDGE = [
      {
        keywords: ["admission", "apply", "registration", "form"],
        answer:
          "Admission open hai. Aap website ke Admission section me form fill karke apply kar sakte hain. Hamara academic coordinator 24 hours ke andar contact karega."
      },
      {
        keywords: ["location", "address", "kahan", "where"],
        answer:
          "Saraan Career Institute Near Agrasen Circle, Alwar me located hai. Aap direct campus visit bhi kar sakte hain."
      },
      {
        keywords: ["faculty", "faculties", "teacher", "experience"],
        answer:
          "Hamare key faculty me Rajat Pancholi Sir (Biology, 13 years), Ankit Sharma Sir (Physics, 16 years), aur Sachin Bhargava Sir (Maths, 18 years) shamil hain."
      },
      {
        keywords: ["fees", "fee", "discount", "relaxation", "rbse"],
        answer:
          "RBSE students ke liye no school fees ka special benefit diya gaya hai. Detailed fee guidance ke liye admission form ya phone contact best rahega."
      },
      {
        keywords: ["batch", "timing", "class time", "schedule"],
        answer:
          "JEE aur NEET ke morning aur evening batches available hain. Class 9-10 aur 11-12 ke liye bhi alag tuition timings diye gaye hain website ke Batch Timing section me."
      },
      {
        keywords: ["course", "jee", "neet", "foundation"],
        answer:
          "Institute JEE Preparation, NEET Preparation, Classes 9-10 Foundation, aur Classes 11-12 academic support provide karta hai."
      },
      {
        keywords: ["phone", "contact", "call", "number"],
        answer:
          "Aap in numbers par contact kar sakte hain: 8741901718, 9529437215, aur 9413978210."
      }
    ];
  
    const SUGGESTIONS = [
      "Admission open kab tak hai?",
      "Institute ki location kya hai?",
      "Faculty ke naam aur experience?",
      "Fees me kya relaxation hai?",
      "Batch timing batao"
    ];
  
    const selectors = {
      navToggle: document.querySelector(".nav-toggle"),
      primaryNav: document.querySelector(".primary-nav"),
      navLinks: document.querySelectorAll(".nav-link"),
      themeToggle: document.querySelector("[data-theme-toggle]"),
      testModal: document.getElementById("testModal"),
      testTitle: document.getElementById("testTitle"),
      qNumber: document.getElementById("qNumber"),
      qText: document.getElementById("qText"),
      optionsList: document.getElementById("optionsList"),
      prevBtn: document.getElementById("prevBtn"),
      nextBtn: document.getElementById("nextBtn"),
      resultContainer: document.getElementById("resultContainer"),
      quizContainer: document.getElementById("quizContainer"),
      scoreDisplay: document.getElementById("scoreDisplay"),
      scoreRemark: document.getElementById("scoreRemark"),
      quizProgressFill: document.getElementById("quizProgressFill"),
      testTriggers: document.querySelectorAll(".test-start"),
      testCloseTriggers: document.querySelectorAll("[data-close-test]"),
      chatbotLauncher: document.getElementById("chatbotLauncher"),
      chatbotWindow: document.getElementById("chatbotWindow"),
      chatbotClose: document.getElementById("chatbotClose"),
      chatContainer: document.getElementById("chatContainer"),
      chatSuggestions: document.getElementById("chatSuggestions"),
      userInput: document.getElementById("userInput"),
      sendMsgBtn: document.getElementById("sendMsgBtn"),
      sections: document.querySelectorAll("main section[id]")
    };
  
    function init() {
      setTheme(state.theme);
      bindThemeToggle();
      bindNav();
      bindSectionObserver();
      bindTests();
      bindChatbot();
      renderSuggestions();
    }
  
    function setTheme(theme) {
      state.theme = theme;
      document.documentElement.setAttribute("data-theme", theme);
    }
  
    function bindThemeToggle() {
      selectors.themeToggle?.addEventListener("click", () => {
        setTheme(state.theme === "dark" ? "light" : "dark");
      });
    }
  
    function bindNav() {
      selectors.navToggle?.addEventListener("click", () => {
        const isOpen = selectors.primaryNav.classList.toggle("is-open");
        selectors.navToggle.setAttribute("aria-expanded", String(isOpen));
      });
  
      selectors.navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          selectors.navLinks.forEach((item) => item.classList.remove("is-active"));
          link.classList.add("is-active");
          selectors.primaryNav.classList.remove("is-open");
          selectors.navToggle?.setAttribute("aria-expanded", "false");
        });
      });
    }
  
    function bindSectionObserver() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            selectors.navLinks.forEach((link) => {
              const match = link.getAttribute("href") === `#${id}`;
              link.classList.toggle("is-active", match);
            });
          });
        },
        { threshold: 0.45 }
      );
  
      selectors.sections.forEach((section) => observer.observe(section));
    }
  
    function bindTests() {
      selectors.testTriggers.forEach((button) => {
        button.addEventListener("click", () => startTest(button.dataset.test));
      });
  
      selectors.testCloseTriggers.forEach((button) => {
        button.addEventListener("click", closeTest);
      });
  
      selectors.prevBtn?.addEventListener("click", prevQuestion);
      selectors.nextBtn?.addEventListener("click", nextQuestion);
  
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && selectors.testModal.classList.contains("is-open")) {
          closeTest();
        }
      });
    }
  
    function startTest(type) {
      const testSet = TEST_DATABASE[type];
      if (!testSet) return;
  
      state.activeTest = type;
      state.currentQuestionIndex = 0;
      state.studentAnswers = new Array(testSet.length).fill(null);
  
      selectors.testTitle.textContent = `Saraan ${type.toUpperCase()} Practice Test`;
      selectors.resultContainer.classList.add("hidden");
      selectors.quizContainer.classList.remove("hidden");
      document.getElementById("testFooterControls").classList.remove("hidden");
  
      selectors.testModal.classList.add("is-open");
      selectors.testModal.setAttribute("aria-hidden", "false");
  
      loadQuestion();
    }
  
    function closeTest() {
      selectors.testModal.classList.remove("is-open");
      selectors.testModal.setAttribute("aria-hidden", "true");
    }
  
    function loadQuestion() {
      const questions = TEST_DATABASE[state.activeTest];
      const current = questions[state.currentQuestionIndex];
  
      selectors.qNumber.textContent = `Question ${state.currentQuestionIndex + 1} of ${questions.length}`;
      selectors.qText.textContent = current.q;
      selectors.optionsList.innerHTML = "";
  
      current.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option-item";
        button.textContent = option;
  
        if (state.studentAnswers[state.currentQuestionIndex] === index) {
          button.classList.add("selected");
        }
  
        button.addEventListener("click", () => {
          state.studentAnswers[state.currentQuestionIndex] = index;
          loadQuestion();
        });
  
        selectors.optionsList.appendChild(button);
      });
  
      selectors.prevBtn.disabled = state.currentQuestionIndex === 0;
      selectors.nextBtn.textContent =
        state.currentQuestionIndex === questions.length - 1 ? "Submit Test" : "Next Question";
  
      const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100;
      selectors.quizProgressFill.style.width = `${progress}%`;
    }
  
    function nextQuestion() {
      const questions = TEST_DATABASE[state.activeTest];
      if (!questions) return;
  
      if (state.currentQuestionIndex < questions.length - 1) {
        state.currentQuestionIndex += 1;
        loadQuestion();
      } else {
        submitTest();
      }
    }
  
    function prevQuestion() {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        loadQuestion();
      }
    }
  
    function submitTest() {
      const questions = TEST_DATABASE[state.activeTest];
      const score = questions.reduce((total, question, index) => {
        return total + (state.studentAnswers[index] === question.correct ? 1 : 0);
      }, 0);
  
      selectors.quizContainer.classList.add("hidden");
      document.getElementById("testFooterControls").classList.add("hidden");
      selectors.resultContainer.classList.remove("hidden");
      selectors.scoreDisplay.textContent = `${score} / ${questions.length}`;
      selectors.scoreRemark.textContent = getScoreRemark(score, questions.length);
      selectors.quizProgressFill.style.width = "100%";
    }
  
    function getScoreRemark(score, total) {
      const percent = (score / total) * 100;
      if (percent >= 80) return "Excellent performance. Keep pushing at this level.";
      if (percent >= 60) return "Good work. A little more revision will improve your score.";
      if (percent >= 40) return "Average attempt. Focus on weak concepts and practice again.";
      return "You need more revision. Start with basics and reattempt the test.";
    }
  
    function bindChatbot() {
      selectors.chatbotLauncher?.addEventListener("click", toggleChatbot);
      selectors.chatbotClose?.addEventListener("click", closeChatbot);
      selectors.sendMsgBtn?.addEventListener("click", sendMessage);
      selectors.userInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") sendMessage();
      });
    }
  
    function toggleChatbot() {
      const isHidden = selectors.chatbotWindow.hasAttribute("hidden");
      if (isHidden) {
        selectors.chatbotWindow.removeAttribute("hidden");
        selectors.chatbotLauncher.setAttribute("aria-expanded", "true");
        selectors.userInput.focus();
      } else {
        closeChatbot();
      }
    }
  
    function closeChatbot() {
      selectors.chatbotWindow.setAttribute("hidden", "");
      selectors.chatbotLauncher.setAttribute("aria-expanded", "false");
    }
  
    function renderSuggestions() {
      selectors.chatSuggestions.innerHTML = "";
      SUGGESTIONS.forEach((question) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "suggestion-chip";
        chip.textContent = question;
        chip.addEventListener("click", () => handleUserQuery(question));
        selectors.chatSuggestions.appendChild(chip);
      });
    }
  
    function sendMessage() {
      const value = selectors.userInput.value.trim();
      if (!value) return;
      handleUserQuery(value);
      selectors.userInput.value = "";
    }
  
    function handleUserQuery(question) {
      appendMessage(question, "user");
      const answer = resolveChatReply(question);
      window.setTimeout(() => {
        appendMessage(answer, "bot");
      }, 350);
    }
  
    function appendMessage(text, type) {
      const message = document.createElement("div");
      message.className = `msg ${type}`;
      message.textContent = text;
      selectors.chatContainer.appendChild(message);
      selectors.chatContainer.scrollTop = selectors.chatContainer.scrollHeight;
    }
  
    function resolveChatReply(input) {
      const normalized = input.toLowerCase();
  
      for (const entry of CHAT_KNOWLEDGE) {
        if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
          return entry.answer;
        }
      }
  
      if (normalized.includes("hello") || normalized.includes("hi")) {
        return "Hello! Aap admission, fees, faculty, batches, test series, ya location ke baare me pooch sakte hain.";
      }
  
      return "Main aapki help kar sakta hoon admission, fees, faculty, location, batch timing aur courses ke baare me. Kripya apna sawal thoda specific likhiye.";
    }
  
    function createQuestionSet(prefix, baseQuestions, totalCount) {
      const questions = [];
  
      for (let i = 0; i < totalCount; i += 1) {
        const source = baseQuestions[i % baseQuestions.length];
        const cycle = Math.floor(i / baseQuestions.length) + 1;
  
        questions.push({
          id: `${prefix.toLowerCase()}-${i + 1}`,
          q: `${source.q} (${prefix} Practice ${cycle})`,
          options: [...source.options],
          correct: source.correct
        });
      }
  
      return questions;
    }
  
    return { init };
  })();
  
  document.addEventListener("DOMContentLoaded", App.init);