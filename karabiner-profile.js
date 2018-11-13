const CONFIG_PATH = `${process.env.HOME}/.config/karabiner/karabiner.json`
const ASSET_PATH = `${process.env.HOME}/.config/karabiner/assets/complex_modifications/`

const fs = require('fs')
const util = require('util')

// TODO:
// make keyboard layout svg

// KEY IDEAS
// hyper+command+{f,p} = select(?) to home/end
// hyper+ctrl+{f,p} = select to home/end
// hyper+option+{f,p} = page-up / page-down ???

setTimeout(() => {
  let get_stdout = buffer_stdout()

  // console.log('# HYPER-WorkMan (UNEO)')
  console.log('# hyper-workman')
  console.log(`a super cool keyboard configuration inspired by [Enhanced CapsLock](https://github.com/Vonng/Capslock) and then tailored for the [Workman Keyboard Layout](https://workmanlayout.org/).`)
  console.log('')
  console.log(`it uses the UNEO right-hand keys for navigation`)
  console.log('---')
  let rules = [
    // the second rule
    {
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
    },
    // the main rule
    {
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
    },


    generate_manipulators(
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
        // hyper_("f", "home"),
        // hyper_("p", "end"),
        hyper_("cmd+f", "page_up"),
        hyper_("cmd+p", "page_down"),
      ]),
    ),

    generate_manipulators(
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
        super_("cmd+f", "shift+page_up"),
        super_("cmd+p", "shift+page_down"),
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

    generate_manipulators(
      "Hyper Manipulation",
      "buffer modification",
      hyper_group("move line under cursor up / down", [
        hyper_("cmd+u", "ctrl+cmd+up"),
        hyper_("cmd+e", "ctrl+cmd+down"),
        hyper_("d", "backspace", "backspace shortcut"), // TODO: make this smart??
        super_("d", "delete", "delete selection"), // TODO: make this smart??
      ]),
    ),

    generate_manipulators(
      "Hyper Cursor",
      "cursor modification",
      hyper_group("duplicate cursor on the line above / below", [
        super_("ctrl+u", "shift+ctrl+up"),
        super_("ctrl+e", "shift+ctrl+down"),
      ]),
    ),

    generate_manipulators(
      "Hyper Shift",
      "hyper should behave like shift (most of the time)",
      hyper_group("hyper behaves like shift for these keys", [
        // nothing special about these actually
        // make sure to eventually move them to do other commands
        // space - open some sort of command prompt or something? (maybe emacs emulation)
        // backspace - ???
        // enter - dunno... it's kinda far from where the hand sits...
        "enter", "backspace", "space",
        "semicolon", "equal_sign", "non_us_pound",
        1, 2, 3, 4, 5, 6, 7, 8, 9, 0
      ].map((key) => hyper_(key, 'shift+'+key, key+'')))
    ),

    // generate_manipulators(
    //   "Hyper Command",
    //   "hyper should behave like command -- the rest of the time",
    //   hyper_group("hyper command stuff", [
    //     "slash", // hyper+/ should toggle comment
    //     "open_bracket", "close_bracket", // hyper+[] should indent / dedent
    //   ].map((key) => hyper_(key, 'cmd+'+key)))
    // ),

    generate_manipulators(
      "Hyper Normal",
      "hyper should not modify these keys' behaviour",
      hyper_group("hyper normal keys", [
        "quote", "comma", "period",
      ].map((key) => hyper_(key, key, key+'')))
    ),

    generate_manipulators(
      "Hyper Atom",
      "atom specific programming commands",
      hyper_group("special atom configuration", [
        // hyper_("d", "cmd+d", "select next instance of selected"),
        super_("space", "cmd+d", "select next instance of selected"),
        hyper_("cmd+d", "cmd+shift+d", "duplicate line in atom"),
        super_("cmd+d", "cmd+shift+d", "duplicate line in atom"),
      ]),

      hyper_group("common atom keys", [
        hyper_("opt+d", "ctrl+shift+k", "delete line in atom"),
        hyper_("cmd+backspace", "cmd+backspace", "delete until beginning of line"),
        hyper_("opt+backspace", "opt+backspace", "delete word"),
        hyper_("backspace", "delete_forward", "delete one char in front"),
        hyper_("delete_forward", "option+delete_forward", "delete one word in front"),
        hyper_("option+delete_forward", "cmd+delete_forward", "delete till end of line"),
        hyper_("/", "cmd+/", "toggle comment"),
        hyper_("[", "cmd+[", "dedent line"),
        hyper_("]", "cmd+]", "indent line"),
      ])
    ),
  ]

  const complex_modifications_hyper_workman = {
    title: "hyper-workman",
    author: "heavyk (kenny@gatunes.com)",
    "hostpage": "https://pqrs.org/osx/karabiner/complex_modifications/",
    "manual": "https://github.com/heavyk/hyper-workman/tree/master",
    "import_url": "karabiner://karabiner/assets/complex_modifications/import?url=https://raw.githubusercontent.com/heavyk/hyper-worman/master/hyper_workman.json",
    rules: rules
  }

  const README = get_stdout().join('')+'\n'
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
}, 0)


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

function generate_manipulators (title, description, ...manipulators) {
  console.log('\n\n### ' + title)
  if (description) console.log('\n##### ' + description)

  manipulators = print_manipulators(manipulators)
  return { description, manipulators }
}

function print_manipulators (manipulators) {
  let manipz = []
  let has_description = false
  for (let manipulator of manipulators) {
    if (manipulator.heading) {
      // manipulators group
      console.log('\n#### ' + manipulator.heading)
      let get_stdout = buffer_stdout()
      let sub_manipz = print_manipulators(manipulator.manipulators)
      let saved_buffer = get_stdout()
      console.log('| from | to |' + (sub_manipz.has_description ? ' description |' : ''))
      console.log('| --- | --- |' + (sub_manipz.has_description ? ' --- |' : ''))
      saved_buffer.forEach(process.stdout.write)
      manipz.push(...sub_manipz)
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

function hyper_ (from, to, opts = {}) {
  // TODO: in case of from/to being an object
  from = (opts.super ? 'super+' : 'hyper+') + from
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
