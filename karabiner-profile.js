// TODO:
// make a keyboard layout svg
// make a GUI configuration?

const hyper_selector_rule = () => ({
  description: 'Hyper + Tab = Hyper Selector',
  manipulators: [{
    from: {
      key_code: 'tab',
      modifiers: { optional: [ 'any' ], mandatory: [ 'right_command', 'right_control', 'right_option', 'right_shift' ] }
    },
    to: [{
      lazy: true,
      key_code: 'left_shift',
      modifiers: [ 'right_command', 'right_control', 'right_option', 'right_shift' ]
    }],
    parameters: { "basic.to_if_alone_timeout_milliseconds": 200 }, // any faster, and it's too fast to cmd+tab between windows
    to_if_alone: [{ key_code: 'tab' }],
    type: 'basic'
  }]
})

const hyper_caps_lock_rule = () => ({
  description: 'CapsLock to Hyper/Escape',
  manipulators: [{
    from: {
      key_code: 'caps_lock',
      modifiers: { optional: [ 'any' ] }
    },
    to: [{
      lazy: true,
      key_code: 'right_shift',
      modifiers: [ 'right_command', 'right_control', 'right_option' ]
    }],
    to_if_alone: [{ key_code: 'escape' }],
    type: 'basic'
  }]
})


function enumerate_rules () {
  return [
    // the second rule
    hyper_selector_rule(),
    // the main rule
    hyper_caps_lock_rule(),

    // super rules need to come first (karabiner can get confused, otherwise)
    make_rules(
      "Super Selection",
      "selecting chars under the cursor with super",

      hyper_group("select up / down one line", [
        super_("u", "shift+up"),
        super_("e", "shift+down"),
      ]),

      hyper_group("normal 1-char selection left / right", [
        super_("n", "shift+left"),
        super_("o", "shift+right"),
      ]),

      hyper_group("select to beginning / end of line", [
        super_("cmd+n", "shift+home"),
        super_("cmd+o", "shift+end"),
      ]),

      hyper_group("select up / down 1-page", [
        super_("cmd+u", "shift+page_up"),
        super_("cmd+e", "shift+page_down"),
      ]),

      hyper_group("select up / down 1-paragraph", [
        super_("opt+u", "shift+opt+up"),
        super_("opt+e", "shift+opt+down"),
      ]),

      hyper_group("select til beginning / end of word", [
        super_("opt+n", "shift+opt+left"),
        super_("opt+o", "shift+opt+right"),
      ]),

      // hyper_group("select til beginning / end of word", [
      //   super_("opt+n", "shift+opt+left"),
      //   super_("opt+o", "shift+opt+right"),
      // ]),
    ),

    make_rules(
      "Super Atom",
      "atom specific programming commands",
      hyper_group("special atom configuration", [
        super_("space", "cmd+d", "select next instance of selected"),
        super_("p", "cmd+d", "select next instance of selected"),
        super_(";", "cmd+o", "skip selection of next instance of selected"),
        // super_("cmd+p", "cmd+o", "skip selection of next instance of selected"),
        super_("f", "cmd+u", "undo selection of next instance of selected"),
        super_("cmd+d", "cmd+shift+d", "duplicate line in atom"),
      ]),
    ),

    make_rules(
      "Hyper Navigation",
      "move the cursor around (UNEO configuration)",

      hyper_group("move 1-char", [
        hyper_("u", "up", "move up 1-char"),
        hyper_("e", "down", "move down 1-char"),
        hyper_("n", "left", "move left 1-char"),
        hyper_("o", "right", "move right 1-char"),
      ]),

      hyper_group("move to beginning / end of line", [
        hyper_("cmd+n", "home"),
        hyper_("cmd+o", "end"),
      ]),

      hyper_group("move up / down 1-page", [
        hyper_("cmd+f", "page_up"),
        hyper_("cmd+p", "page_down"),
      ]),

      hyper_group("move up / down 1-paragraph", [
        hyper_("opt+u", "opt+up"),
        hyper_("opt+e", "opt+down"),
      ]),

      hyper_group("move left / right 1-word", [
        hyper_("opt+n", "opt+left"),
        hyper_("opt+o", "opt+right"),
      ]),

      // I kind of don't know what to do with this.
      // it seems like the home and end are maybe a bit clunky, since cmd+(left/right) go to home end
      // probably, I will want to make it some sort of smart movement control thing ... dunno yet
      hyper_group("normal jumping", [
        hyper_("f", "home"),
        hyper_("p", "end"),
        hyper_("cmd+f", "page_up"),
        hyper_("cmd+p", "page_down"),
      ]),
    ),

    // improve error msg
    // first, copy+paste
    // then the cursor changes
    make_rules(
      "Hyper Manipulation",
      "buffer modification",
      hyper_group("move line under cursor up / down", [
        hyper_("cmd+u", "ctrl+cmd+up"),
        hyper_("cmd+e", "ctrl+cmd+down"),
        super_("d", "backspace", "backspace shortcut"), // TODO: make this smart??
        hyper_("d", "delete", "delete selection"), // TODO: make this smart??
      ]),

      hyper_group("indent / dedent", [
        hyper_("cmd+[", "cmd+[", "indent"),
        hyper_("cmd+]", "cmd+]", "indent"),
      ]),
    ),

    make_rules(
      "Hyper Cursor",
      "cursor modification",
      hyper_group("duplicate cursor on the line above / below", [
        super_("ctrl+u", "shift+ctrl+up"),
        super_("ctrl+e", "shift+ctrl+down"),
      ]),

      // TODO: undo / redo cursor positions
    ),

    make_rules(
      "Hyper Shift",
      "hyper should behave like shift (most of the time)",
      hyper_group("hyper behaves like shift for these keys", [
        // nothing special about these actually
        // make sure to eventually move them to do other commands
        // space - open some sort of command prompt or something? (maybe emacs emulation)
        // backspace - ???
        // enter - dunno... it's kinda far from where the hand sits...
        "open_bracket", "close_bracket",
        "backspace", "period", "~",
        "semicolon", "equal_sign", "quote", "non_us_pound",
        1, 2, 3, 4, 5, 6, 7, 8, 9, 0
      ].map((key) => hyper_(key, 'shift+'+key, key+'')))
    ),

    make_rules(
      "Hyper Command",
      "sometimes, hyper should also behave like command",
      hyper_group("hyper command stuff", [
        // "slash", // hyper+/ should toggle comment
        // "open_bracket", "close_bracket", // hyper+[] should indent / dedent
        // I have run into quite a few times now the use-case where I try to do open brace more than indent
      ].map((key) => hyper_(key, 'cmd+'+key))),

      hyper_group("essential commands", [
        hyper_("q", "cmd+x", "cut"),
        hyper_("r", "cmd+c", "copy"),
        hyper_("v", "cmd+v", "paste"),
        hyper_("s", "cmd+s", "save"),
        // hyper_("a", "cmd+a", "select-all"),
        hyper_("z", "cmd+z", "undo"),
        hyper_("cmd+z", "cmd+shift+z", "redo"),
      ]),
    ),

    make_rules(
      "Hyper Normal",
      "hyper should not modify these keys' behaviour",
      hyper_group("super normal keys", [
        // see: https://gist.github.com/mutewinter/6847308
        "comma", // on US kbds, this should be '<' -- otherwise, it'll call sysdiagnose (only tailspin)
        // "period", // on US kbds, this should be '>' -- otherwise, it'll call sysdiagnose (full)
        "slash", // on US kbds, this should be '?' -- otherwise, it'll call sysdiagnose
      ].map((key) => super_(key, 'shift+'+key, 'shift+'+key))),

      hyper_group("hyper normal keys", [
        "comma",
        // "period",
        "hyphen",
        // "space",
        "i", // atom is stupid, and hyper+i will open the dev console
      ].map((key) => hyper_(key, key, key+''))),
    ),

    make_rules(
      "Hyper Atom",
      "atom specific programming commands",
      hyper_group("special atom configuration", [
        hyper_("cmd+d", "cmd+shift+d", "duplicate line in atom"),
        hyper_("opt+d", "ctrl+shift+k", "delete line in atom"),
      ]),

      hyper_group("common atom shortcuts mapped to hyper", [
        hyper_("cmd+backspace", "cmd+backspace", "delete until beginning of line"),
        hyper_("opt+backspace", "opt+backspace", "delete word"),
        hyper_("backspace", "delete_forward", "delete one char in front"),
        hyper_("delete_forward", "option+delete_forward", "delete one word in front"),
        hyper_("option+delete_forward", "cmd+delete_forward", "delete till end of line"),
        hyper_("/", "cmd+/", "toggle comment"),
        hyper_("[", "cmd+[", "dedent line"),
        hyper_("]", "cmd+]", "indent line"),
        hyper_("cmd+enter", "shift+cmd+enter", "newline above"),
        hyper_("enter", "cmd+enter", "newline below"),
      ]),
    ),
  ]
}

const CONFIG_PATH = `${process.env.HOME}/.config/karabiner/karabiner.json`
const ASSET_PATH = `${process.env.HOME}/.config/karabiner/assets/complex_modifications/`

const fs = require('fs')
const util = require('util')


// ========================
// ========================


const qwerty = {}
const workman = {
  "w": "d",
  "e": "r",
  "r": "w",
  "t": "b",
  "y": "j",
  "u": "f",
  "i": "u",
  "o": "p",
  "p": "semicolon",
  "d": "h",
  "f": "t",
  "h": "y",
  "j": "n",
  "k": "e",
  "l": "o",
  "semicolon": "i",
  "c": "m",
  "v": "c",
  "b": "v",
  "m": "l",
  "n": "k"
}

Object.keys(workman).forEach((key) => qwerty[workman[key]] = key)


// ========================
// ========================


const transform_key = {
  // short names
  "^": "control",
  "opt": "option",
  "cmd": "command",
  "ctrl": "control",
  "del": "delete",
  "space": "spacebar",

  // default to left-side modifiers
  "option": "left_option",
  "command": "left_command",
  "control": "left_control",
  "shift": "left_shift",

  // arrows
  "up": "up_arrow",
  "down": "down_arrow",
  "left": "left_arrow",
  "right": "right_arrow",

  // single-char special keys
  "\\": "non_us_pound",
  "[": "open_bracket",
  "]": "close_bracket",
  "~": "grave_accent_and_tilde",
  "-": "hyphen",
  "=": "equal_sign",
  "'": "quote",
  "/": "slash",
  ",": "comma",
  ".": "period",
  ";": "semicolon",

  // osx weirdness
  "delete": "delete_forward",
  "enter": "return_or_enter",
  "return": "return_or_enter",
  "backspace": "delete_or_backspace"
}

// most of these taken from:
// http://xahlee.info/comp/unicode_computing_symbols.html
// also here:
// https://www.key-shortcut.com/en/mac-osx/command-keys-mac/
const key_symbols = {
  // official apple symbols
  "command": "⌘",
  "control": "⌃",
  "option": "⌥",
  "shift": "⇧",
  "caps_lock": "⇪",

  // additional symbols
  "hyper": "✧",
  "super": "◇",
  "menu": "☰",
  "alt": "⎇",

  // standard directions
  "up": "↑",
  "left": "←",
  "right": "→",
  "down": "↓",

  "page_up": "⇞",
  "page_down": "⇟",
  // these appear on the keyboard layout
  "home": "⤒",
  "end": "⤓",
  // in help, it references these:
  // "home": "↖",
  // "end": "↘",
  // these appear on older models (yet seem to make the most sense)
  // "home": "⇤",
  // "end": "⇥",

  // standard keys
  "delete": "⌦",
  // "enter": "⏎",
  "enter": "⌤",
  "return": "↩",
  "backspace": "⌫",
  "clear": "⌧",

  "print_screen": "⎙",
}

// allow for keys to be referenced by symbol
// and also reverse-map all transforms, too
Object.keys(transform_key).forEach((key) => {
  let t = transform_key[key]
  let sk = key_symbols[key]
  let st = key_symbols[t]
  if (sk) key_symbols[key] = sk
  if (st) key_symbols[key] = st
  if (key.length === 1) key_symbols[t] = key
})


// ========================
// ========================


const MODIFIERS = {
  hyper: ['right_command', 'right_control', 'right_shift', 'right_option'],
  super: ['right_command', 'right_control', 'right_shift', 'right_option', 'left_shift'],
  // maybe in the future, I want to add a 'menu' command.
  // I'm thinking that this feature addition would be a part of a more complete package ...
  // I'm thinking like a full UI and all sorts of stuff
  // I'd be sweet if the tilde button activated a UI menu or something...
}

// for each modifier, add its value a concatenatable array
;['command', 'shift', 'control', 'option'].forEach((key) => {
  MODIFIERS['left_' + key] = [ 'left_' + key ]
  MODIFIERS['right_' + key] = [ 'right_' + key ]
})


// ========================
// ========================


function update_config (path, rules, selected = true) {
  const config = JSON.parse(fs.readFileSync(path, "utf8"))
  for (let i = 0; i < config.profiles.length; i++) {
    let profile = config.profiles[i]
    if (profile.name === selected || profile.selected === selected) {
      console.log(`updating profile: '${profile.name}'`)
      profile.complex_modifications.rules = rules
      fs.writeFileSync(path, JSON.stringify(config, null, '  '), 'utf8')
      console.log(`wrote ${path}`)
      return console.log('karabiner profile successfully updated.')
    }
  }

  console.error(`unable to locate karabiner profile: ${selected}`)
}

function make_rules (title, description, ...manipulators) {
  console.log('\n\n### ' + title)
  if (description) console.log('\n##### ' + description)

  manipulators = print_manipulators(manipulators)
  return { title, description, manipulators }
}

function print_manipulators (manipulators) {
  let manipz = []
  let has_description = false
  for (let manipulator of manipulators) {
    if (manipulator.heading) {
      // manipulators group
      let get_stdout = buffer_stdout()
      let sub_manipz = print_manipulators(manipulator.manipulators)
      let saved_buffer = get_stdout()
      if (sub_manipz.length) {
        console.log('\n#### ' + manipulator.heading)
        console.log('| from | to |' + (sub_manipz.has_description ? ' description |' : ''))
        console.log('| --- | --- |' + (sub_manipz.has_description ? ' --- |' : ''))
        saved_buffer.forEach(process.stdout.write)
        manipz.push(...sub_manipz)
      }
    } else {
      // individual manipulators
      if (print_key_description(manipulator.description)) has_description = true
      // console.log(util.inspect(manipulator, {depth: 4, breakLength: 150}) + '\n')
      manipz.push(manipulator)
    }
  }

  manipz.has_description = has_description
  return manipz
}

function print_key_description (str) {
  let parts
  if (parts = /(.*) \-\> (.*) \((.*)\)/.exec(str)) {
    console.log(`| ${pretty_keys(parts[1])} | ${pretty_keys(parts[2])} | *${parts[3]}* |`)
  } else if (parts = /(.*) \-\> (.*)/.exec(str)) {
    console.log(`| ${pretty_keys(parts[1])} | ${pretty_keys(parts[2])} |`)
  } else throw new Error(`unable to parse description: ${str}`)

  return !!parts[3]
}

function pretty_keys(str) {
  let keys = str.split('+')
  let kbd = []

  for (let key of keys) {
    if (key in MODIFIERS) kbd.push(key_symbols[key] || key)
    else kbd.push(key_symbols[key] || key)
  }

  return `<kbd>${kbd.join('</kbd>+<kbd>')}</kbd>`
}

function hyper_group (heading, manipulators) {
  return {heading, manipulators}
}

const hyper_keys = {}
function hyper_ (from, to, opts = {}) {
  let exists = hyper_keys[from]
  if (exists) {
    console.error(`
      attempted to map hyper shortcut '${from}' at:
        ${get_source_location('hyper_')}

      however, it's already mapped at:
        ${exists.loc}

        FIX: delete duplicate
      `)
  }

  // TODO: in case of from/to being an object
  from = (opts.super ? 'super+' : 'hyper+') + from
  hyper_keys[from] = { loc: get_source_location(opts.super ? 'super_' : 'hyper_'), to }
  let desc = typeof opts === 'string' ? ` (${opts})`
    : typeof opts.description === 'string' ? ` (${opts.description})`
    : ''

  return {
    description: `${from} -> ${to}` + desc,
    from: get_key(from, to, opts),
    to: [ get_key(to) ],
    type: 'basic'
  }
}

function super_ (from, to, opts = {}) {
  let exists = hyper_keys[from]
  if (exists) {
    console.error(`
      attempted to map super shortcut '${from}' at:
        ${get_source_location('super_')}

      however, another shortcut '${from}' is already mapped at:
        ${exists.loc}

        FIX: define the super varient first. karabiner can get confused otherwise
      `)
  }

  if (typeof opts === 'string') opts = { description: opts }
  opts.super = true
  return hyper_(from, to, opts)
}

function get_key (str, mandatory = false) {
  let code = {key_code: null}
  let modifiers = []
  let keys = str.split('+')

  for (let key of keys) {
    // key name transformations
    while (key in transform_key) key = transform_key[key]

    // add modifier, else key
    if (key in MODIFIERS) modifiers.push(...MODIFIERS[key])
    else code.key_code = qwerty[key] || key
  }

  if (code.key_code === null) throw new Error(`unknown key code: '${str}'`)
  if (modifiers.length) code.modifiers = mandatory ? { mandatory: modifiers } : modifiers

  return code
}

// ========================
// ========================

function buffer_stdout () {
  let buffer = []
  const old_stdout = process.stdout.write
  process.stdout.write = (txt) => { buffer.push(txt) }

  return function (flush) {
    process.stdout.write = old_stdout
    if (flush) buffer.forEach(old_stdout.write)
    return buffer
  }
}

function get_source_location (fn_name) {
  try {
    throw new Error()
  } catch (e) {
    const stack = e.stack.split('\n')
    const idx = stack.findIndex((s) => s.includes('at ' + fn_name)) + 1
    return stack[idx].substring(1 + stack[idx].indexOf('('), stack[idx].length - 1)
  }

  return 'unknown'
}

// ========================
// ========================

function write_output (get_stdout, rules) {
  const complex_modifications_hyper_workman = {
    title: "hyper-workman",
    author: "heavyk (kenny@gatunes.com)",
    "hostpage": "https://pqrs.org/osx/karabiner/complex_modifications/",
    "manual": "https://github.com/heavyk/hyper-workman/tree/master",
    "import_url": "karabiner://karabiner/assets/complex_modifications/import?url=https://raw.githubusercontent.com/heavyk/hyper-worman/master/hyper_workman.json",
    rules: rules
  }

  const header = fs.readFileSync(__dirname + '/README-header.md', 'utf8')
  const README = header + get_stdout().join('') + '\n'
  const json = JSON.stringify(complex_modifications_hyper_workman, null, '  ') + '\n'

  console.log('README: '+Buffer.byteLength(README)+' bytes')
  console.log('json: '+Buffer.byteLength(json)+' bytes')
  console.log('')

  fs.writeFileSync(`${__dirname}/hyper_workman.json`, json)
  console.log(`wrote ${__dirname}/hyper_workman.json`)
  fs.writeFileSync(`${__dirname}/README.md`, README)
  console.log(`wrote ${__dirname}/README.md`)

  let profile = process.argv[2]
  if (profile) {
    if (!~process.argv.indexOf('--no_local')) {
      fs.writeFileSync(`${ASSET_PATH}/hyper_workman.json`, json)
      console.log(`wrote ${ASSET_PATH}/hyper_workman.json`)
    }

    console.log('')
    update_config(CONFIG_PATH, rules, profile === 'update_local' || profile === 'true' || profile)
  } else {
    console.log('to update your karabiner profile:\n > node karabiner-profile.js update_local')
  }
}

setTimeout(() => {
  let get_stdout = buffer_stdout()
  let rules = enumerate_rules()
  write_output(get_stdout, rules)
}, 0)

if (!process.parent) {
  if (~process.argv.indexOf('--watch')) (function () {
    try {
      const chalk = require('chalk')
      const chokidar = require('chokidar')
      const clear_module = require('clear-module')
      chokidar.watch(__filename).on('change', (st) => {
        console.log('file changed! reloading...\n')
        clear_module(__filename)
        try {
          require(__filename)
        } catch (e) {
          console.error(e)
        }
      })
    } catch (e) {
      console.log('could not find modules necessary to watch')
    }
  })()
}

module.exports = { hyper_, super_, make_rules, hyper_group, hyper_selector_rule, hyper_caps_lock_rule }
