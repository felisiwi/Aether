export class SessionRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private chunks: Blob[] = []
  private streamDest: MediaStreamAudioDestinationNode | null = null
  private startTime = 0
  private _recording = false

  constructor(
    private audioCtx: AudioContext,
    private sourceNode: AudioNode,
  ) {}

  get recording(): boolean {
    return this._recording
  }

  get elapsed(): number {
    return this._recording ? Date.now() - this.startTime : 0
  }

  start(): void {
    if (this._recording) return

    this.streamDest = this.audioCtx.createMediaStreamDestination()
    this.sourceNode.connect(this.streamDest)
    this.chunks = []

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm'

    this.mediaRecorder = new MediaRecorder(this.streamDest.stream, { mimeType })
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data)
    }
    this.mediaRecorder.start(1000)
    this.startTime = Date.now()
    this._recording = true
  }

  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this._recording) {
        reject(new Error('Not recording'))
        return
      }

      this.mediaRecorder.onstop = () => {
        try {
          this.sourceNode.disconnect(this.streamDest!)
        } catch { /* already disconnected */ }
        this.streamDest = null
        this._recording = false
        resolve(new Blob(this.chunks, { type: this.mediaRecorder!.mimeType }))
      }
      this.mediaRecorder.stop()
    })
  }

  static download(blob: Blob, filename?: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename ?? `aether-session-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
