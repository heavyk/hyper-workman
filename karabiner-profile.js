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
  let readme = []
  const old_stdout = process.stdout.write
  process.stdout.write = (txt) => {
    readme.push(txt)
  }

  // console.log('# HYPER-WorkMan (UNEO)')
  console.log('# hyper-workman')
  console.log(`a super cool keyboard configuration inspired by [Enhanced CapsLock](https://github.com/Vonng/Capslock) and then tailored for the [Workman Keyboard Layout](https://workmanlayout.org/).`)
  console.log('')
  console.log(`it uses the UNEO right-hand keys for navigation`)
  console.log('---')
  let rules = [
    // the main rule
    {
      description: 'CapsLock to Hyper/Escape',
      manipulators: [{
        from: {
          key_code: 'caps_lock',
          modifiers: { optional: ['any'] }
        },
        to: [{
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

      hyper_group("move up / down / left / right 1-char", [
        hyper("u", "up"),
        hyper("e", "down"),
        hyper("n", "left"),
        hyper("o", "right"),
      ]),

      hyper_group("normal jumping", [
        // hyper("f", "home"),
        // hyper("p", "end"),
        hyper("cmd+f", "page_up"),
        hyper("cmd+p", "page_down"),
      ]),

      hyper_group("move to beginning / end of line", [
        hyper("cmd+n", "home"),
        hyper("cmd+o", "end"),
      ]),

      hyper_group("move up / down 1-page", [
        hyper("cmd+f", "page_up"),
        hyper("cmd+p", "page_down"),
      ]),

      hyper_group("move up / down 1-paragraph", [
        hyper("opt+u", "opt+up"),
        hyper("opt+e", "opt+down"),
      ]),

      hyper_group("move left / right 1-word", [
        hyper("opt+n", "opt+left"),
        hyper("opt+o", "opt+right"),
      ])
    ),

    generate_manipulators(
      "Hyper Selection",
      "selecting chars under the cursor",

      hyper_group("normal 1-char selection left / right", [
        hyper("ctrl+n", "shift+left"),
        hyper("ctrl+o", "shift+right"),
      ]),

      hyper_group("select til beginning / end of word", [
        hyper("ctrl+n", "shift+opt+left"),
        hyper("ctrl+o", "shift+opt+right"),
      ]),

      hyper_group("selection up / down to line", [
        hyper("ctrl+u", "shift+up"),
        hyper("ctrl+e", "shift+down"),
      ]),

      hyper_group("select to beginning / end of line", [
        hyper("opt+f", "shift+home"),
        hyper("opt+p", "shift+end"),
      ])
    ),

    generate_manipulators(
      "Hyper Manipulation",
      "buffer modification",
      hyper_group("move line under cursor up / down", [
        hyper("cmd+u", "shift+opt+up"),
        hyper("cmd+e", "shift+opt+down"),
      ])
    ),

    generate_manipulators(
      "Hyper Cursor",
      "cursor modification",
      hyper_group("duplicate cursor on the line above / below", [
        // hyper("opt+u", "shift+ctrl+up"),
        // hyper("opt+e", "shift+ctrl+down"),
      ])
    ),

    generate_manipulators(
      "Hyper Shift",
      "hyper should behave like shift -- most of the time",
      hyper_group("hyper shift stuff", [
        "enter", "backspace", "space",
        "quote", "slash", "comma", "period", "semicolon",
        "hyphen", "equal_sign", "non_us_pound",
        "open_bracket", "close_bracket",
        1, 2, 3, 4, 5, 6, 7, 8, 9, 0
      ].map((key) => hyper(key, 'shift+'+key)))
    ),

    generate_manipulators(
      "Hyper Programmer",
      "atom specific programming commands",
      hyper_group("special atom configuration", [
        hyper("d", "cmd+d"), // select next instance of selected
        hyper("cmd+d", "cmd+shift+d"), // duplicate line in atom
        hyper("opt+d", "ctrl+shift+k"), // delete line in atom
        hyper("cmd+backspace", "cmd+backspace"), // delete until beginning of line
        hyper("opt+backspace", "opt+backspace"), // delete word
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

  process.stdout.write = old_stdout

  const README = readme.join('')+'\n'
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

const key_symbols = {
  // official apple symbols
  "command": "⌘",
  "control": "⌃",
  "option": "⌥",
  "shift": "⇧",
  "caps_lock": "⇪",

  // additional symbols
  "hyper": "*",
}

// allow for keys to be referenced by symbol, too
Object.keys(key_symbols).forEach((key) => transform_key[key_symbols[key]] = key)


// ========================
// ========================


const MODIFIERS = {
  hyper: ['right_command', 'right_control', 'right_shift', 'right_option']
  // ... (TODO: add more???)
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
  for (let manipulator of manipulators) {
    if (manipulator.heading) {
      // group
      console.log('\n#### ' + manipulator.heading)
      console.log('| from | to | description |')
      console.log('| --- | --- | --- |')
      manipz.push(...print_manipulators(manipulator.manipulators))
    } else {
      // TODO: do little key inserts
      // let txt = `- ${pretty_keys(manipulator.keys)}`
      // if (manipulator.description) txt += ` (${manipulator.description})`
      // console.log(`- ${pretty_keys(manipulator.keys)}` + manipulator.description ? ` (${manipulator.description})` : '')
      print_key_description(manipulator.description)
      // console.log(util.inspect(manipulator, {depth: 4, breakLength: 150}) + '\n')
      manipz.push(manipulator)
    }
  }

  return manipz
}

function print_key_description (str) {
  let parts
  if (parts = /(.*) \-\> (.*) \((.*)\)/.exec(str)) {
    console.log(`| ${pretty_keys(parts[1])} | ${pretty_keys(parts[2])} | *${parts[3]}* |`)
  } else if (parts = /(.*) \-\> (.*)/.exec(str)) {
    console.log(`| ${pretty_keys(parts[1])} | ${pretty_keys(parts[2])} | |`)
  } else throw new Error(`unable to parse description: ${str}`)
}

function pretty_keys(str) {
  let keys = str.split('+')
  let kbd = []

  for (let key of keys) {
    if (key in MODIFIERS) kbd.push(key_symbols[key] || key)
    else kbd.push(key)
  }

  return `<kbd>${kbd.join('</kbd>+<kbd>')}</kbd>`
}

function hyper_group (heading, manipulators) {
  return {heading, manipulators}
}

function hyper (from, to, opts = {}) {
  // TODO: in case of from/to being an object
  from = 'hyper+' + from
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
