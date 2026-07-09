// ============================================
// Emoji Match — Memory Card Game
// ============================================

const EMOJI_SET = ['🚀', '💎', '🔥', '🌈', '🦊', '🐙', '⚡', '🎮'];
const FLIP_DELAY_MS = 900;
const TOTAL_PAIRS = EMOJI_SET.length;

// ---- Game State ----

const game_state = {
    cards: [],
    flipped_indices: [],
    matched_indices: new Set(),
    move_count: 0,
    match_count: 0,
    timer_id: null,
    elapsed_seconds: 0,
    is_locked: false,
    timer_started: false
};

// ---- DOM References ----

const board_el = document.getElementById('game-board');
const move_count_el = document.getElementById('move-count');
const match_count_el = document.getElementById('match-count');
const timer_el = document.getElementById('timer');
const message_el = document.getElementById('game-message');
const reset_btn = document.getElementById('reset-btn');
const win_overlay = document.getElementById('win-overlay');
const win_message_el = document.getElementById('win-message');
const play_again_btn = document.getElementById('play-again-btn');

// ---- Core Game Functions ----

function init_game() {
    const paired_emojis = [...EMOJI_SET, ...EMOJI_SET];
    game_state.cards = shuffle_array(paired_emojis);
    game_state.flipped_indices = [];
    game_state.matched_indices = new Set();
    game_state.move_count = 0;
    game_state.match_count = 0;
    game_state.is_locked = false;
    game_state.timer_started = false;

    stop_timer();
    game_state.elapsed_seconds = 0;

    render_board();
    update_stats();
    show_message('🎯 Find all matching pairs!', '');
    hide_win_screen();
}

function flip_card(index) {
    if (game_state.is_locked) return;
    if (game_state.flipped_indices.includes(index)) return;
    if (game_state.matched_indices.has(index)) return;

    if (!game_state.timer_started) {
        start_timer();
        game_state.timer_started = true;
    }

    game_state.flipped_indices.push(index);
    update_card_visual(index, true);

    if (game_state.flipped_indices.length === 2) {
        game_state.move_count++;
        update_stats();
        check_match();
    }
}

function check_match() {
    const [first, second] = game_state.flipped_indices;
    const first_emoji = game_state.cards[first];
    const second_emoji = game_state.cards[second];

    game_state.is_locked = true;

    if (first_emoji === second_emoji) {
        handle_match(first, second);
    } else {
        handle_mismatch(first, second);
    }
}

function handle_match(first, second) {
    game_state.matched_indices.add(first);
    game_state.matched_indices.add(second);
    game_state.match_count++;
    game_state.flipped_indices = [];
    game_state.is_locked = false;

    mark_card_matched(first);
    mark_card_matched(second);
    update_stats();

    show_message(`✨ Match found! ${game_state.cards[first]} + ${game_state.cards[second]}`, 'mg-message-success');

    if (game_state.match_count === TOTAL_PAIRS) {
        stop_timer();
        setTimeout(() => show_win_screen(), 600);
    }
}

function handle_mismatch(first, second) {
    show_message('🔄 Not a match — try again!', 'mg-message-info');

    setTimeout(() => {
        update_card_visual(first, false);
        update_card_visual(second, false);
        game_state.flipped_indices = [];
        game_state.is_locked = false;
    }, FLIP_DELAY_MS);
}

// ---- Rendering ----

function render_board() {
    board_el.innerHTML = '';

    game_state.cards.forEach((emoji, index) => {
        const card = create_card_element(emoji, index);
        board_el.appendChild(card);
    });
}

function create_card_element(emoji, index) {
    const card = document.createElement('div');
    card.className = 'mg-card';
    card.dataset.index = index;

    card.innerHTML = `
        <div class="mg-card-face mg-card-back"></div>
        <div class="mg-card-face mg-card-front">${emoji}</div>
    `;

    card.addEventListener('click', () => flip_card(index));
    return card;
}

function update_card_visual(index, is_flipped) {
    const card = board_el.children[index];
    if (!card) return;

    if (is_flipped) {
        card.classList.add('mg-card-flipped');
    } else {
        card.classList.remove('mg-card-flipped');
    }
}

function mark_card_matched(index) {
    const card = board_el.children[index];
    if (!card) return;
    card.classList.add('mg-card-matched');
}

function update_stats() {
    move_count_el.textContent = game_state.move_count;
    match_count_el.textContent = `${game_state.match_count} / ${TOTAL_PAIRS}`;
    timer_el.textContent = format_time(game_state.elapsed_seconds);
}

function show_message(text, css_class) {
    message_el.textContent = text;
    message_el.className = 'mg-message';
    if (css_class) {
        message_el.classList.add(css_class);
    }
}

// ---- Timer ----

function start_timer() {
    stop_timer();
    game_state.elapsed_seconds = 0;

    game_state.timer_id = setInterval(() => {
        game_state.elapsed_seconds++;
        timer_el.textContent = format_time(game_state.elapsed_seconds);
    }, 1000);
}

function stop_timer() {
    if (game_state.timer_id) {
        clearInterval(game_state.timer_id);
        game_state.timer_id = null;
    }
}

function format_time(total_seconds) {
    const minutes = Math.floor(total_seconds / 60);
    const seconds = total_seconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// ---- Win Screen ----

function show_win_screen() {
    const time_str = format_time(game_state.elapsed_seconds);
    win_message_el.innerHTML =
        `🎯 Moves: <strong>${game_state.move_count}</strong><br>` +
        `⏱️ Time: <strong>${time_str}</strong>`;

    win_overlay.classList.add('mg-overlay-visible');
}

function hide_win_screen() {
    win_overlay.classList.remove('mg-overlay-visible');
}

// ---- Utilities ----

function shuffle_array(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function reset_game() {
    init_game();
}

// ---- Event Listeners ----

reset_btn.addEventListener('click', reset_game);
play_again_btn.addEventListener('click', reset_game);

// ---- Start ----

init_game();
