class CreateFriends < ActiveRecord::Migration[6.1]
  def change
    create_table :friends, id: false do |t|
      t.integer :friend_id
      t.references :users, null: false, foreign_key: true

      t.timestamps
    end
  end
end
