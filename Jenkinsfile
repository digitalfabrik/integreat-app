pipeline {
    agent any
    options {
        timeout(time: 1, unit: 'HOURS')
    }
    stages {
        stage('Run on mac and master') {
            failFast true
            parallel {
                stage('mac') {
                    agent {
                        label "mac"
                    }
                    stages {
                        stage("Install dependencies") {
                            steps {
                                sh 'yarn'
                            }
                        }
                        stage('Build Release for iOS') {
                            steps {
                                sh 'cd ios && pod install'
                                sh 'xcodebuild -workspace ios/Integreat.xcworkspace -scheme "Integreat" -configuration Release archive -archivePath output/Integreat.xcarchive'
                                sh 'xcodebuild -exportArchive -archivePath output/Integreat.xcarchive -exportOptionsPlist ios/export/development.plist -exportPath output/export'
                                archiveArtifacts artifacts: 'output/export/**/*.*'
                            }
                        }
                    }
                }
                stage('master') {
                    agent {
                        label "master"
                    }
                    stages {
                        stage("Install dependencies") {
                            steps {
                                sh 'yarn'
                            }
                        }
                        stage("Build Debug Bundle") {
                            steps {
                                sh 'yarn run bundle'
                            }
                        }
                        stage('Build Release for Android') {
                            environment {
                                ANDROID_HOME = '/opt/android-sdk/'
                            }
                            steps {
                                sh 'yarn run flow:check-now'
                                sh 'yarn run lint'
                                sh 'yarn run test'
                                sh 'yarn run android:release'
                                archiveArtifacts artifacts: 'android/app/build/outputs/apk/**/*.*'
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

